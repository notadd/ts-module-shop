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
const user_receiving_information_entity_1 = require("../model/user.receiving.information.entity");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const user_1 = require("@notadd/user");
const typeorm_2 = require("@nestjs/typeorm");
let UserReceivingInformationService = class UserReceivingInformationService {
    constructor(userComponent, userReceivingInformationRepository) {
        this.userComponent = userComponent;
        this.userReceivingInformationRepository = userReceivingInformationRepository;
    }
    getUserReceivingInformation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const information = yield this.userReceivingInformationRepository.findOneById(id);
            if (!information) {
                throw new common_1.HttpException("指定id=" + id + "用户收货信息不存在", 404);
            }
            return information;
        });
    }
    getUserReceivingInformations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userComponent.getUserById(userId);
            if (!user) {
                throw new common_1.HttpException("指定id=" + userId + "用户不存在", 404);
            }
            const informations = yield this.userReceivingInformationRepository.find({ userId });
            return informations;
        });
    }
    createUserReceivingInformation(userId, consignee, email, region, address, postCode, homePhone, mobilePhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userComponent.getUserById(userId);
            if (!user) {
                throw new common_1.HttpException("指定id=" + userId + "用户不存在", 404);
            }
            try {
                yield this.userReceivingInformationRepository.save({ userId, consignee, email, region, address, postCode, homePhone, mobilePhone });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateUserReceivingInformation(id, consignee, email, region, address, postCode, homePhone, mobilePhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const userReveivingInformation = yield this.userReceivingInformationRepository.findOneById(id);
            if (!userReveivingInformation) {
                throw new common_1.HttpException("指定id=" + id + "用户收货信息不存在", 404);
            }
            userReveivingInformation.consignee = consignee;
            userReveivingInformation.email = email;
            userReveivingInformation.region = region;
            userReveivingInformation.address = address;
            userReveivingInformation.postCode = postCode;
            userReveivingInformation.homePhone = homePhone;
            userReveivingInformation.mobilePhone = mobilePhone;
            try {
                yield this.userReceivingInformationRepository.save(userReveivingInformation);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteUserReceivingInformation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userReveivingInformation = yield this.userReceivingInformationRepository.findOneById(id);
            if (!userReveivingInformation) {
                throw new common_1.HttpException("指定id=" + id + "用户收货信息不存在", 404);
            }
            try {
                yield this.userReceivingInformationRepository.remove(userReveivingInformation);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
UserReceivingInformationService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject(user_1.UserComponentToken)),
    __param(1, typeorm_2.InjectRepository(user_receiving_information_entity_1.UserReceivingInformation)),
    __metadata("design:paramtypes", [user_1.UserComponent,
        typeorm_1.Repository])
], UserReceivingInformationService);
exports.UserReceivingInformationService = UserReceivingInformationService;
