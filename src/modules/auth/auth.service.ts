import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDAO } from 'src/types/dao/create-user.dao';
import { UserDTO } from 'src/types/dto/user.dto';
import { UserTable } from 'src/types/tables/user.table';
import { comparePassword, hashPassword } from 'src/utils/password-utils';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  login = async (user: {
    password: string;
    email: string;
  }): Promise<UserDTO> => {
    this.logger.log('user login...');

    const validatedUser: UserTable = await this.usersService.findUser(
      user.email,
    );

    if (
      validatedUser &&
      (await comparePassword(user.password, validatedUser.password))
    ) {
      const returnedEmail = validatedUser.email;
      const returnedId = validatedUser._id;
      const returnedName = validatedUser.name;
      const returnedPhoto = validatedUser.photo;
      const returnedIsActivated = validatedUser.isActivated;
      const returnedActivationLink = validatedUser.activationLink;

      if (!returnedIsActivated) {
        await this.mailService.sendActivationMail(
          user.email,
          `${this.configService.get<string>('API_URL')}/auth/activate/${
            validatedUser.activationLink
          }`,
        );
      }

      return {
        token: await this.jwtService.sign({
          email: returnedEmail,
          name: returnedName,
          id: returnedId,
          photo: returnedPhoto,
          isActivated: returnedIsActivated,
          activationLink: returnedActivationLink,
        }),
        name: returnedName,
        email: returnedEmail,
        photo: returnedPhoto,
        id: returnedId,
        isActivated: returnedIsActivated,
        activationLink: returnedActivationLink,
      };
    }
    throw new UnauthorizedException();
  };

  create = async (user: CreateUserDAO): Promise<UserDTO> => {
    this.logger.log('user registration...');

    const existingUser = await this.usersService.findUser(user.email);

    if (existingUser) {
      throw new BadRequestException();
    }

    const activationLink = String(Date.now());
    const hash = await hashPassword(user.password);
    const createdUser = await this.usersService.createUser({
      ...user,
      password: hash,
      activationLink,
    });
    const returnedEmail = createdUser.email;
    const returnedId = createdUser._id;
    const returnedName = createdUser.name;
    const returnedPhoto = createdUser.photo;
    const returnedIsActivated = createdUser.isActivated;
    const returnedActivationLink = createdUser.activationLink;

    await this.mailService.sendActivationMail(
      user.email,
      `${this.configService.get<string>(
        'API_URL',
      )}/auth/activate/${activationLink}`,
    );

    return {
      token: await this.jwtService.sign({
        email: returnedEmail,
        name: returnedName,
        id: returnedId,
        photo: returnedPhoto,
        isActivated: returnedIsActivated,
        activationLink: returnedActivationLink,
      }),
      email: returnedEmail,
      name: returnedName,
      photo: returnedPhoto,
      id: returnedId,
      isActivated: returnedIsActivated,
      activationLink: returnedActivationLink,
    };
  };

  verify = async (user: Omit<UserDTO, 'token'>) => {
    try {
      const fetchedUser = await this.usersService.findUser(user.email);

      const returnedId = fetchedUser._id;
      const returnedName = fetchedUser.name;
      const returnedPhoto = fetchedUser.photo;
      const returnedEmail = fetchedUser.email;
      const returnedIsActivated = fetchedUser.isActivated;
      const returnedActivationLink = fetchedUser.activationLink;

      if (!returnedIsActivated) {
        await this.mailService.sendActivationMail(
          user.email,
          `${this.configService.get<string>('API_URL')}/auth/activate/${
            fetchedUser.activationLink
          }`,
        );
      }

      return {
        token: await this.jwtService.sign({
          email: returnedEmail,
          name: returnedName,
          id: returnedId,
          photo: returnedPhoto,
          isActivated: returnedIsActivated,
          activationLink: returnedActivationLink,
        }),
        email: returnedEmail,
        name: returnedName,
        photo: returnedPhoto,
        id: returnedId,
        isActivated: returnedIsActivated,
        activationLink: returnedActivationLink,
      };
    } catch {
      throw new UnauthorizedException();
    }
  };

  activateAccount = async (link: string) => {
    return this.usersService.activateAccount(link);
  };

  sendEmail = async (link: string, email: string) => {
    await this.mailService.sendActivationMail(
      email,
      `${this.configService.get<string>('API_URL')}/auth/activate/${link}`,
    );
  };

  sendReset = async (email: string) => {
    try {
      const user = await this.usersService.findUser(email);

      if (!user) {
        throw new UnauthorizedException();
      }

      const password = String(Date.now());
      const hash = await hashPassword(password);

      await this.usersService.resetPassword(email, hash);

      await this.mailService.sendPassword(
        user.email,
        `${this.configService.get<string>('API_URL')}/users/passConfirm/${
          user.activationLink
        }`,
        password,
      );
    } catch {
      throw new BadRequestException();
    }
  };
}
