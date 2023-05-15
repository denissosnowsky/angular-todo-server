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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const password_utils_1 = require("../../utils/password-utils");
const mail_service_1 = require("../mail/mail.service");
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService, mailService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.login = async (user) => {
            this.logger.log('user login...');
            const validatedUser = await this.usersService.findUser(user.email);
            if (validatedUser &&
                (await (0, password_utils_1.comparePassword)(user.password, validatedUser.password))) {
                const returnedEmail = validatedUser.email;
                const returnedId = validatedUser._id;
                const returnedName = validatedUser.name;
                const returnedPhoto = validatedUser.photo;
                const returnedIsActivated = validatedUser.isActivated;
                const returnedActivationLink = validatedUser.activationLink;
                if (!returnedIsActivated) {
                    await this.mailService.sendActivationMail(user.email, `${this.configService.get('API_URL')}/auth/activate/${validatedUser.activationLink}`);
                }
                return {
                    token: await this.jwtService.sign({
                        email: returnedEmail,
                        name: returnedName,
                        id: returnedId,
                        photo: returnedPhoto,
                        isActivated: returnedIsActivated,
                        activationLink: returnedActivationLink,
                    }),
                    name: returnedName,
                    email: returnedEmail,
                    photo: returnedPhoto,
                    id: returnedId,
                    isActivated: returnedIsActivated,
                    activationLink: returnedActivationLink,
                };
            }
            throw new common_1.UnauthorizedException();
        };
        this.create = async (user) => {
            this.logger.log('user registration...');
            const existingUser = await this.usersService.findUser(user.email);
            if (existingUser) {
                throw new common_1.BadRequestException();
            }
            const activationLink = String(Date.now());
            const hash = await (0, password_utils_1.hashPassword)(user.password);
            const createdUser = await this.usersService.createUser(Object.assign(Object.assign({}, user), { password: hash, activationLink }));
            const returnedEmail = createdUser.email;
            const returnedId = createdUser._id;
            const returnedName = createdUser.name;
            const returnedPhoto = createdUser.photo;
            const returnedIsActivated = createdUser.isActivated;
            const returnedActivationLink = createdUser.activationLink;
            await this.mailService.sendActivationMail(user.email, `${this.configService.get('API_URL')}/auth/activate/${activationLink}`);
            return {
                token: await this.jwtService.sign({
                    email: returnedEmail,
                    name: returnedName,
                    id: returnedId,
                    photo: returnedPhoto,
                    isActivated: returnedIsActivated,
                    activationLink: returnedActivationLink,
                }),
                email: returnedEmail,
                name: returnedName,
                photo: returnedPhoto,
                id: returnedId,
                isActivated: returnedIsActivated,
                activationLink: returnedActivationLink,
            };
        };
        this.verify = async (user) => {
            try {
                const fetchedUser = await this.usersService.findUser(user.email);
                const returnedId = fetchedUser._id;
                const returnedName = fetchedUser.name;
                const returnedPhoto = fetchedUser.photo;
                const returnedEmail = fetchedUser.email;
                const returnedIsActivated = fetchedUser.isActivated;
                const returnedActivationLink = fetchedUser.activationLink;
                if (!returnedIsActivated) {
                    await this.mailService.sendActivationMail(user.email, `${this.configService.get('API_URL')}/auth/activate/${fetchedUser.activationLink}`);
                }
                return {
                    token: await this.jwtService.sign({
                        email: returnedEmail,
                        name: returnedName,
                        id: returnedId,
                        photo: returnedPhoto,
                        isActivated: returnedIsActivated,
                        activationLink: returnedActivationLink,
                    }),
                    email: returnedEmail,
                    name: returnedName,
                    photo: returnedPhoto,
                    id: returnedId,
                    isActivated: returnedIsActivated,
                    activationLink: returnedActivationLink,
                };
            }
            catch (_a) {
                throw new common_1.UnauthorizedException();
            }
        };
        this.activateAccount = async (link) => {
            return this.usersService.activateAccount(link);
        };
        this.sendEmail = async (link, email) => {
            await this.mailService.sendActivationMail(email, `${this.configService.get('API_URL')}/auth/activate/${link}`);
        };
        this.sendReset = async (email) => {
            try {
                const user = await this.usersService.findUser(email);
                if (!user) {
                    throw new common_1.UnauthorizedException();
                }
                const password = String(Date.now());
                const hash = await (0, password_utils_1.hashPassword)(password);
                await this.usersService.resetPassword(email, hash);
                await this.mailService.sendPassword(user.email, `${this.configService.get('API_URL')}/users/passConfirm/${user.activationLink}`, password);
            }
            catch (_a) {
                throw new common_1.BadRequestException();
            }
        };
    }
};
AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map