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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const store_setting_entity_1 = require("../model/store.setting.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let StoreSettingService = class StoreSettingService {
    constructor(storeComponent, storeSettingRepository) {
        this.storeComponent = storeComponent;
        this.storeSettingRepository = storeSettingRepository;
    }
    getStoreSetting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeSetting = yield this.storeSettingRepository.findOne(1);
            if (!storeSetting) {
                throw new common_1.HttpException("商城配置不存在", 404);
            }
            storeSetting.logoUrl = yield this.storeComponent.getUrl(req, storeSetting.logoBucketName, storeSetting.logoName, storeSetting.logoType, undefined);
            return storeSetting;
        });
    }
    saveStoreSetting(logoBucketName, logoRawName, logoBase64, title, region, address, close, closeReason, servicePhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bucketName, name, type } = yield this.storeComponent.upload(logoBucketName, logoRawName, logoBase64, undefined);
            try {
                const setting = this.storeSettingRepository.create({
                    id: 1,
                    logoBucketName: bucketName,
                    logoName: name,
                    logoType: type,
                    title,
                    region,
                    address,
                    close,
                    closeReason,
                    servicePhone
                });
                yield this.storeSettingRepository.save(setting);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    clearStoreSetting() {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield this.storeSettingRepository.findOne(1);
            if (!setting) {
                throw new common_1.HttpException("商城设置不存在", 404);
            }
            try {
                yield this.storeComponent.delete(setting.logoBucketName, setting.logoName, setting.logoType);
                yield this.storeSettingRepository.remove(setting);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
StoreSettingService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject("StoreComponentToken")),
    __param(1, typeorm_1.InjectRepository(store_setting_entity_1.StoreSetting)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository])
], StoreSettingService);
exports.StoreSettingService = StoreSettingService;

//# sourceMappingURL=store.setting.service.js.map
