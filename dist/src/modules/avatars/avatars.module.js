"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const avatars_controller_1 = require("./avatars.controller");
const avatars_repository_1 = require("./avatars.repository");
const avatars_service_1 = require("./avatars.service");
const avatars_schema_1 = require("./schemas/avatars.schema");
let AvatarsModule = class AvatarsModule {
};
AvatarsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: avatars_schema_1.Avatar.name, schema: avatars_schema_1.AvatarSchema }]),
            config_1.ConfigModule.forRoot(),
        ],
        providers: [avatars_service_1.AvatarsService, avatars_repository_1.AvatarsRepository],
        controllers: [avatars_controller_1.AvatarsController],
    })
], AvatarsModule);
exports.AvatarsModule = AvatarsModule;
//# sourceMappingURL=avatars.module.js.map