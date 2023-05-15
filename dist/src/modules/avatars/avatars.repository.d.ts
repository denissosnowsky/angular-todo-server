import { Model } from 'mongoose';
import { AvatarTable } from 'src/types/tables/avatar.table';
import { AvatarDocument } from './schemas/avatars.schema';
export declare class AvatarsRepository {
    private avatarModel;
    constructor(avatarModel: Model<AvatarDocument>);
    getAvatars(): Promise<AvatarTable[]>;
}
