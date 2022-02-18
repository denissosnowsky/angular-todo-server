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
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

      return {
        token: await this.jwtService.sign({
          email: returnedEmail,
          name: returnedName,
          id: returnedId,
          photo: returnedPhoto,
        }),
        name: returnedName,
        email: returnedEmail,
        photo: returnedPhoto,
        id: returnedId,
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

    const hash = await hashPassword(user.password);
    const createdUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });
    const returnedEmail = createdUser.email;
    const returnedId = createdUser._id;
    const returnedName = createdUser.name;
    const returnedPhoto = createdUser.photo;

    return {
      token: await this.jwtService.sign({
        email: returnedEmail,
        name: returnedName,
        id: returnedId,
        photo: returnedPhoto,
      }),
      email: returnedEmail,
      name: returnedName,
      photo: returnedPhoto,
      id: returnedId,
    };
  };

  verify = async (user: Omit<UserDTO, 'token'>) => {
    const fetchedUser = await this.usersService.findUser(user.email);

    const returnedId = fetchedUser._id;
    const returnedName = fetchedUser.name;
    const returnedPhoto = fetchedUser.photo;
    const returnedEmail = fetchedUser.email;

    return {
      token: await this.jwtService.sign({
        email: returnedEmail,
        name: returnedName,
        id: returnedId,
        photo: returnedPhoto,
      }),
      email: returnedEmail,
      name: returnedName,
      photo: returnedPhoto,
      id: returnedId,
    };
  };
}
