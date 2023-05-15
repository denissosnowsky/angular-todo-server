import { Response } from 'express';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    changeName(nameBody: {
        name: string;
    }, req: any): Promise<string>;
    uploadPhoto(photoBody: {
        photoName: string;
    }, req: any): Promise<void>;
    changePassword(nameBody: {
        oldPass: string;
        newPass: string;
    }, req: any): Promise<void>;
    passConfirm(link: string, response: Response): Promise<void>;
    changeEmail(nameBody: {
        email: string;
    }, req: any): Promise<void>;
}
