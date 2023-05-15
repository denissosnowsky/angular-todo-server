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
var AvatarsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarsService = void 0;
const common_1 = require("@nestjs/common");
const avatars_repository_1 = require("./avatars.repository");
let AvatarsService = AvatarsService_1 = class AvatarsService {
    constructor(avatarsRepository) {
        this.avatarsRepository = avatarsRepository;
        this.logger = new common_1.Logger(AvatarsService_1.name);
    }
    async getAvatars() {
        this.logger.log('avatars fetching...');
        try {
            return this.avatarsRepository.getAvatars();
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
};
AvatarsService = AvatarsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [avatars_repository_1.AvatarsRepository])
], AvatarsService);
exports.AvatarsService = AvatarsService;
//# sourceMappingURL=avatars.service.js.map