import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    changeName(nameBody: {
        name: string;
    }, req: any): Promise<string>;
    uploadPhoto(photoBody: {
        photoName: string;
    }, req: any): void;
    changePassword(nameBody: {
        oldPass: string;
        newPass: string;
    }, req: any): Promise<void>;
    changeEmail(nameBody: {
        email: string;
    }, req: any): Promise<void>;
}
