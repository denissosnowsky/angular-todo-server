import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';

import { User, UserSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
    MailModule,
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
