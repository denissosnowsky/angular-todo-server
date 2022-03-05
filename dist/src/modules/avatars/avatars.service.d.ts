import { AvatarTable } from 'src/types/tables/avatar.table';
import { AvatarsRepository } from './avatars.repository';
export declare class AvatarsService {
    private avatarsRepository;
    private readonly logger;
    constructor(avatarsRepository: AvatarsRepository);
    getAvatars(): Promise<AvatarTable[]>;
}
