import { Injectable, Logger } from '@nestjs/common';
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
    return this.usersRepository.createUser(createUser);
  }

  async findUser(email: string): Promise<UserTable> {
    this.logger.log('user finding...');
    return this.usersRepository.findUser(email);
  }
}
