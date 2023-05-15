import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private readonly logger;
    private transporter;
    private getTransporter;
    constructor(configService: ConfigService);
    sendActivationMail(to: string, link: string): Promise<void>;
    sendPasswordChangeConfirmation(to: string, link: string): Promise<void>;
    sendPassword(to: string, link: string, password: string): Promise<void>;
}
