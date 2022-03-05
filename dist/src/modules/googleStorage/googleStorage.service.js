"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GoogleStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStorageService = void 0;
const common_1 = require("@nestjs/common");
const storage_1 = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
let GoogleStorageService = GoogleStorageService_1 = class GoogleStorageService {
    constructor() {
        this.logger = new common_1.Logger(GoogleStorageService_1.name);
        this.getGoogleBucket = () => {
            if (!this.googleBucket) {
                const gc = new storage_1.Storage({
                    keyFilename: path.join(__dirname, '../../../../sigmatodos-afe6b2b1f3d5.json'),
                    projectId: 'sigmatodos',
                });
                const createdBucket = gc.bucket('sigma-todos');
                this.googleBucket = createdBucket;
                return createdBucket;
            }
            return this.googleBucket;
        };
        this.addPhoto = async (req, name) => {
            req.pipe(fs.createWriteStream('src/modules/googleStorage/image.png'));
            console.log(fs.existsSync('src/modules/googleStorage/image.png'));
            return await new Promise((res) => fs
                .createReadStream('src/modules/googleStorage/image.png')
                .pipe(this.getGoogleBucket().file(name).createWriteStream({
                resumable: true,
                gzip: true,
            }))
                .on('finish', res));
        };
        this.deletePhoto = async (photoName) => {
            const isPhotoExist = await this.getGoogleBucket().file(photoName).exists();
            if (isPhotoExist[0]) {
                await this.getGoogleBucket().file(photoName).delete();
            }
        };
    }
};
GoogleStorageService = GoogleStorageService_1 = __decorate([
    (0, common_1.Injectable)()
], GoogleStorageService);
exports.GoogleStorageService = GoogleStorageService;
//# sourceMappingURL=googleStorage.service.js.map