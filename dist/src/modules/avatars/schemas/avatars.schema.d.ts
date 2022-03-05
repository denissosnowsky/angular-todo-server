import { Document } from 'mongoose';
export declare type AvatarDocument = Avatar & Document;
export declare class Avatar {
    url: string;
}
export declare const AvatarSchema: import("mongoose").Schema<Document<Avatar, any, any>, import("mongoose").Model<Document<Avatar, any, any>, any, any, any>, any, any>;
