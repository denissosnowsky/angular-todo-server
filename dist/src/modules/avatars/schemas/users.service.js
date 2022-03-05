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
var UsersService_1, _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const password_utils_1 = require("../../../utils/password-utils");
const mail_service_1 = require("../mail/mail.service");
const users_repository_1 = require("./users.repository");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository, mailService, configService) {
        this.usersRepository = usersRepository;
        this.mailService = mailService;
        this.configService = configService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async createUser(createUser) {
        this.logger.log('user creating...');
        try {
            return this.usersRepository.createUser(createUser);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async findUser(email) {
        this.logger.log('user finding...');
        try {
            return this.usersRepository.findUser(email);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async changeName(userId, name) {
        this.logger.log('name change...');
        try {
            return this.usersRepository.changeName(userId, name);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async uploadPhoto(userId, photoName) {
        this.logger.log('photo upload name...');
        try {
            await this.usersRepository.uploadPhoto(userId, photoName);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async activateAccount(link) {
        this.logger.log('approving activation link...');
        try {
            return this.usersRepository.activateAccount(link);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async changePassword(userEmail, oldPass, newPass) {
        this.logger.log('changing password...');
        try {
            const validatedUser = await this.findUser(userEmail);
            if (validatedUser &&
                (await (0, password_utils_1.comparePassword)(oldPass, validatedUser.password))) {
                const hash = await (0, password_utils_1.hashPassword)(newPass);
                await this.usersRepository.changePassword(userEmail, hash);
                return;
            }
            throw new common_1.UnauthorizedException();
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async changeEmail(oldEmail, newEmail) {
        this.logger.log('changing email...');
        try {
            const existingUser = await this.findUser(newEmail);
            if (existingUser) {
                throw new common_1.BadRequestException();
            }
            const activationLink = String(Date.now());
            await this.usersRepository.changeEmail(oldEmail, newEmail, activationLink);
            await this.mailService.sendActivationMail(newEmail, `${this.configService.get('API_URL')}/auth/activate/${activationLink}`);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async resetPassword(email, password) {
        this.logger.log('reseting password...');
        try {
            await this.usersRepository.changePassword(email, password);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
};
UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_repository_1.UsersRepository !== "undefined" && users_repository_1.UsersRepository) === "function" ? _a : Object, typeof (_b = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _b : Object, config_1.ConfigService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map