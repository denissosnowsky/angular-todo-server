import { Model } from 'mongoose';
import { CreateUserDAO } from 'src/types/dao/create-user.dao';
import { UserTable } from 'src/types/tables/user.table';
import { UserDocument } from './schemas/users.schema';
export declare class UsersRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(createUser: CreateUserDAO): Promise<UserTable>;
    findUser(email: string): Promise<UserTable>;
    changeName(userId: string, name: string): Promise<string>;
    uploadPhoto(userId: string, photoName: string): Promise<void>;
    activateAccount(link: string): Promise<void>;
    confirmNewPassword(link: string): Promise<void>;
    changePassword(userEmail: string, password: string): Promise<void>;
    changeEmail(oldEmail: string, newEmail: string, activationLink: string): Promise<void>;
}
