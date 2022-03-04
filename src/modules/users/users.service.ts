import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateUserDAO } from 'src/types/dao/create-user.dao';
import { UserTable } from 'src/types/tables/user.table';
import { comparePassword, hashPassword } from 'src/utils/password-utils';
import { MailService } from '../mail/mail.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private usersRepository: UsersRepository,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async createUser(createUser: CreateUserDAO): Promise<UserTable> {
    this.logger.log('user creating...');
    try {
      return this.usersRepository.createUser(createUser);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findUser(email: string): Promise<UserTable> {
    this.logger.log('user finding...');
    try {
      return this.usersRepository.findUser(email);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async changeName(userId: string, name: string): Promise<string> {
    this.logger.log('name change...');
    try {
      return this.usersRepository.changeName(userId, name);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async uploadPhoto(userId: string, photoName: string): Promise<void> {
    this.logger.log('photo upload name...');
    try {
      await this.usersRepository.uploadPhoto(userId, photoName);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async activateAccount(link: string): Promise<void> {
    this.logger.log('approving activation link...');
    try {
      return this.usersRepository.activateAccount(link);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async confirmNewPassword(link: string): Promise<void> {
    this.logger.log('confirm password link approving...');
    try {
      return this.usersRepository.confirmNewPassword(link);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async changePassword(
    userEmail: string,
    oldPass: string,
    newPass: string,
  ): Promise<void> {
    this.logger.log('changing password...');
    try {
      const validatedUser: UserTable = await this.findUser(userEmail);
      if (
        validatedUser &&
        (await comparePassword(oldPass, validatedUser.password))
      ) {
        const hash = await hashPassword(newPass);
        await this.usersRepository.changePassword(userEmail, hash);

        await this.mailService.sendPasswordChangeConfirmation(
          validatedUser.email,
          `${this.configService.get<string>('API_URL')}/users/passConfirm/${
            validatedUser.activationLink
          }`,
        );
        return undefined;
      }

      throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }
  }

  async changeEmail(oldEmail: string, newEmail: string): Promise<void> {
    this.logger.log('changing email...');
    try {
      const existingUser = await this.findUser(newEmail);

      if (existingUser) {
        throw new BadRequestException();
      }

      const activationLink = String(Date.now());
      await this.usersRepository.changeEmail(
        oldEmail,
        newEmail,
        activationLink,
      );

      await this.mailService.sendActivationMail(
        newEmail,
        `${this.configService.get<string>(
          'API_URL',
        )}/auth/activate/${activationLink}`,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async resetPassword(email: string, password: string): Promise<void> {
    this.logger.log('reseting password...');
    try {
      await this.usersRepository.changePassword(email, password);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
