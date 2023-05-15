import { Response } from 'express';
import { CreateUserDAO } from 'src/types/dao/create-user.dao';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<import("../../types/dto/user.dto").UserDTO>;
    register(body: CreateUserDAO): Promise<import("../../types/dto/user.dto").UserDTO>;
    verify(req: any): Promise<{
        token: string;
        email: string;
        name: string;
        photo: string;
        id: string;
        isActivated: boolean;
        activationLink: string;
    }>;
    activateAccount(link: string, response: Response): Promise<void>;
    sendEmail(body: {
        link: string;
        email: string;
    }): Promise<void>;
    sendReset(body: {
        email: string;
    }): Promise<void>;
}
