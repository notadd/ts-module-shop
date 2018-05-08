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
const pay_setting_entity_1 = require("../model/pay.setting.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PaySettingService = class PaySettingService {
    constructor(paySettingRepository) {
        this.paySettingRepository = paySettingRepository;
    }
    getPaySetting() {
        return __awaiter(this, void 0, void 0, function* () {
            const paySetting = yield this.paySettingRepository.findOneById(1);
            return paySetting;
        });
    }
    savePaySetting(aliPay, weixinPay) {
        return __awaiter(this, void 0, void 0, function* () {
            const paySetting = this.paySettingRepository.create({ id: 1, aliPay: !!aliPay, weixinPay: !!weixinPay });
            try {
                yield this.paySettingRepository.save(paySetting);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    clearPaySetting() {
        return __awaiter(this, void 0, void 0, function* () {
            const paySetting = yield this.paySettingRepository.findOneById(1);
            try {
                yield this.paySettingRepository.remove(paySetting);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
PaySettingService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(pay_setting_entity_1.PaySetting)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaySettingService);
exports.PaySettingService = PaySettingService;
