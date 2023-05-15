import { AvatarTable } from 'src/types/tables/avatar.table';
import { AvatarsService } from './avatars.service';
export declare class AvatarsController {
    private readonly avatarsService;
    constructor(avatarsService: AvatarsService);
    getAvatars(): Promise<AvatarTable[]>;
}
