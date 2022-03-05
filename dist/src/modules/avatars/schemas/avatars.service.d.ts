import { ConfigService } from '@nestjs/config';
import { CreateUserDAO } from 'src/types/dao/create-user.dao';
import { UserTable } from 'src/types/tables/user.table';
import { MailService } from '../mail/mail.service';
import { UsersRepository } from './users.repository';
export declare class UsersService {
    private usersRepository;
    private mailService;
    private configService;
    private readonly logger;
    constructor(usersRepository: UsersRepository, mailService: MailService, configService: ConfigService);
    createUser(createUser: CreateUserDAO): Promise<UserTable>;
    findUser(email: string): Promise<UserTable>;
    changeName(userId: string, name: string): Promise<string>;
    uploadPhoto(userId: string, photoName: string): Promise<void>;
    activateAccount(link: string): Promise<void>;
    changePassword(userEmail: string, oldPass: string, newPass: string): Promise<void>;
    changeEmail(oldEmail: string, newEmail: string): Promise<void>;
    resetPassword(email: string, password: string): Promise<void>;
}
