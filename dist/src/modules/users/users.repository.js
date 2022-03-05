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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_schema_1 = require("./schemas/users.schema");
let UsersRepository = class UsersRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async createUser(createUser) {
        const createdUser = new this.userModel(Object.assign({}, createUser));
        return createdUser.save();
    }
    async findUser(email) {
        return this.userModel.findOne({ email });
    }
    async changeName(userId, name) {
        await this.userModel.findOneAndUpdate({ _id: userId }, { name });
        const updatedUser = await this.userModel.findOne({ _id: userId });
        return updatedUser.name;
    }
    async uploadPhoto(userId, photoName) {
        await this.userModel.findOneAndUpdate({ _id: userId }, { photo: photoName });
    }
    async activateAccount(link) {
        await this.userModel.findOneAndUpdate({ activationLink: link }, { isActivated: true });
    }
    async confirmNewPassword(link) {
        const user = await this.userModel.findOne({ activationLink: link });
        const newPassword = user.changedPassword;
        if (newPassword) {
            await user.updateOne({ password: newPassword, changedPassword: '' });
        }
    }
    async changePassword(userEmail, password) {
        await this.userModel.findOneAndUpdate({ email: userEmail }, { changedPassword: password });
    }
    async changeEmail(oldEmail, newEmail, activationLink) {
        await this.userModel.findOneAndUpdate({ email: oldEmail }, { email: newEmail, activationLink, isActivated: false });
    }
};
UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersRepository);
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users.repository.js.map