import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AvatarsController } from './avatars.controller';
import { AvatarsRepository } from './avatars.repository';
import { AvatarsService } from './avatars.service';
import { Avatar, AvatarSchema } from './schemas/avatars.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
    ConfigModule.forRoot(),
  ],
  providers: [AvatarsService, AvatarsRepository],
  controllers: [AvatarsController],
})
export class AvatarsModule {}
