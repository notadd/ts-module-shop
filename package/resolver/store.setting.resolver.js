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
const exception_interceptor_1 = require("../interceptor/exception.interceptor");
const common_1 = require("@nestjs/common");
const store_setting_service_1 = require("../service/store.setting.service");
const graphql_1 = require("@nestjs/graphql");
let StoreSettingResolver = class StoreSettingResolver {
    constructor(storeSettingService) {
        this.storeSettingService = storeSettingService;
    }
    storeSetting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeSetting = yield this.storeSettingService.getStoreSetting(req);
            return { code: 200, message: "获取商城配置成功", storeSetting };
        });
    }
    saveStoreSetting(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { logoBucketName, logoRawName, logoBase64, title, region, address, close, closeReason, servicePhone } = body;
            if (!logoBucketName || !logoRawName || !logoBase64 || !title || !region || !address || close === undefined || close === null || !servicePhone) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            if (close && !closeReason) {
                throw new common_1.HttpException("商城关闭必须说明关闭原因", 404);
            }
            yield this.storeSettingService.saveStoreSetting(logoBucketName, logoRawName, logoBase64, title, region, address, close, closeReason, servicePhone);
            return { code: 200, message: "保存商城设置成功" };
        });
    }
    clearStoreSetting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storeSettingService.clearStoreSetting();
            return { code: 200, message: "清除商城设置成功" };
        });
    }
};
__decorate([
    graphql_1.Query("storeSetting"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreSettingResolver.prototype, "storeSetting", null);
__decorate([
    graphql_1.Mutation("saveStoreSetting"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreSettingResolver.prototype, "saveStoreSetting", null);
__decorate([
    graphql_1.Mutation("clearStoreSetting"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreSettingResolver.prototype, "clearStoreSetting", null);
StoreSettingResolver = __decorate([
    graphql_1.Resolver("StoreSetting"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(store_setting_service_1.StoreSettingService)),
    __metadata("design:paramtypes", [store_setting_service_1.StoreSettingService])
], StoreSettingResolver);
exports.StoreSettingResolver = StoreSettingResolver;

//# sourceMappingURL=store.setting.resolver.js.map
