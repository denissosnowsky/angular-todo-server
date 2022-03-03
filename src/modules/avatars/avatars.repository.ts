import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AvatarTable } from 'src/types/tables/avatar.table';
import { Avatar, AvatarDocument } from './schemas/avatars.schema';

@Injectable()
export class AvatarsRepository {
  constructor(
    @InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>,
  ) {}

  async getAvatars(): Promise<AvatarTable[]> {
    return this.avatarModel.find();
  }
}
