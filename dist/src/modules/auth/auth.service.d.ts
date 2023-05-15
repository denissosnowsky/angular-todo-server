import { JwtService } from '@nestjs/jwt';
import { CreateUserDAO } from 'src/types/dao/create-user.dao';
import { UserDTO } from 'src/types/dto/user.dto';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailService;
    private configService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService, configService: ConfigService);
    login: (user: {
        password: string;
        email: string;
    }) => Promise<UserDTO>;
    create: (user: CreateUserDAO) => Promise<UserDTO>;
    verify: (user: Omit<UserDTO, 'token'>) => Promise<{
        token: string;
        email: string;
        name: string;
        photo: string;
        id: string;
        isActivated: boolean;
        activationLink: string;
    }>;
    activateAccount: (link: string) => Promise<void>;
    sendEmail: (link: string, email: string) => Promise<void>;
    sendReset: (email: string) => Promise<void>;
}
