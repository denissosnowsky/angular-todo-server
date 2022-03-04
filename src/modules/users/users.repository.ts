import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDAO } from 'src/types/dao/create-user.dao';
import { UserTable } from 'src/types/tables/user.table';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUser: CreateUserDAO): Promise<UserTable> {
    const createdUser = new this.userModel({
      ...createUser,
    });
    return createdUser.save();
  }

  async findUser(email: string): Promise<UserTable> {
    return this.userModel.findOne({ email });
  }

  async changeName(userId: string, name: string): Promise<string> {
    await this.userModel.findOneAndUpdate({ _id: userId }, { name });
    const updatedUser = await this.userModel.findOne({ _id: userId });
    return updatedUser.name;
  }

  async uploadPhoto(userId: string, photoName: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { photo: photoName },
    );
  }

  async activateAccount(link: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { activationLink: link },
      { isActivated: true },
    );
  }

  async confirmNewPassword(link: string): Promise<void> {
    const user = await this.userModel.findOne({ activationLink: link });
    const newPassword = user.changedPassword;
    if (newPassword) {
      await user.updateOne({ password: newPassword, changedPassword: '' });
    }
  }

  async changePassword(userEmail: string, password: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email: userEmail },
      { changedPassword: password },
    );
  }

  async changeEmail(
    oldEmail: string,
    newEmail: string,
    activationLink: string,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email: oldEmail },
      { email: newEmail, activationLink, isActivated: false },
    );
  }
}
