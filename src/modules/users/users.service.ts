import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request as RequestType } from 'express';

import { CreateUserDAO } from 'src/types/dao/create-user.dao';
import { UserTable } from 'src/types/tables/user.table';
import { User } from './schemas/users.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private usersRepository: UsersRepository) {}

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
}
