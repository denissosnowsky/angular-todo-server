import { Request as RequestType } from 'express';
export declare class GoogleStorageService {
    private readonly logger;
    private googleBucket;
    private getGoogleBucket;
    addPhoto: (req: RequestType, name: string) => Promise<void>;
    deletePhoto: (photoName: string) => Promise<void>;
}
