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
const pay_setting_service_1 = require("../service/pay.setting.service");
const graphql_1 = require("@nestjs/graphql");
let PaySettingResolver = class PaySettingResolver {
    constructor(paySettingService) {
        this.paySettingService = paySettingService;
    }
    paySetting() {
        return __awaiter(this, void 0, void 0, function* () {
            const paySetting = yield this.paySettingService.getPaySetting();
            return { code: 200, message: "获取支付设置成功", paySetting };
        });
    }
    savePaySetting(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { aliPay, weixinPay } = body;
            if (aliPay === undefined || aliPay === null || weixinPay === undefined || weixinPay === null) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.paySettingService.savePaySetting(aliPay, weixinPay);
            return { code: 200, message: "保存支付设置成功" };
        });
    }
    clearPaySetting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.paySettingService.clearPaySetting();
            return { code: 200, message: "清除支付配置成功" };
        });
    }
};
__decorate([
    graphql_1.Query("paySetting"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaySettingResolver.prototype, "paySetting", null);
__decorate([
    graphql_1.Mutation("savePaySetting"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaySettingResolver.prototype, "savePaySetting", null);
__decorate([
    graphql_1.Mutation("clearPaySetting"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaySettingResolver.prototype, "clearPaySetting", null);
PaySettingResolver = __decorate([
    graphql_1.Resolver("PaySetting"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(pay_setting_service_1.PaySettingService)),
    __metadata("design:paramtypes", [pay_setting_service_1.PaySettingService])
], PaySettingResolver);
exports.PaySettingResolver = PaySettingResolver;
