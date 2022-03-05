"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.getTransporter = () => {
            try {
                if (!this.transporter) {
                    const transporter = nodemailer.createTransport({
                        host: this.configService.get('SMTP_HOST'),
                        port: this.configService.get('SMTP_PORT'),
                        secure: false,
                        auth: {
                            user: this.configService.get('SMTP_USER'),
                            pass: this.configService.get('SMTP_PASS'),
                        },
                    });
                    this.transporter = transporter;
                    return transporter;
                }
                return this.transporter;
            }
            catch (err) {
                this.logger.error('Failed to connect to mail transporter', err);
            }
        };
    }
    async sendActivationMail(to, link) {
        await this.getTransporter().sendMail({
            from: this.configService.get('SMTP_USER'),
            to,
            subject: 'Confirm your account activation',
            text: '',
            html: `
                <div>
                    <h1>Please, follow the link below to activate your account</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
        });
    }
    async sendPasswordChangeConfirmation(to, link) {
        await this.getTransporter().sendMail({
            from: this.configService.get('SMTP_USER'),
            to,
            subject: 'Confirm your password changing',
            text: '',
            html: `
                <div>
                    <h1>Please, follow the link below to confirm your password changing</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
        });
    }
    async sendPassword(to, link, password) {
        await this.getTransporter().sendMail({
            from: this.configService.get('SMTP_USER'),
            to,
            subject: 'Confirm your password changing',
            text: '',
            html: `
                <div>
                    <h4>Here is your new password: ${password}</h4>
                </div>
                <div>
                    <h1>Please, follow the link below to activate the password. If it wasn't you, ignore the link</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
        });
    }
};
MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map