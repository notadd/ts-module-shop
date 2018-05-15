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
const user_receiving_information_service_1 = require("../service/user.receiving.information.service");
const exception_interceptor_1 = require("../interceptor/exception.interceptor");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let UserReceivingInformationResolver = class UserReceivingInformationResolver {
    constructor(userReceivingInformationService) {
        this.userReceivingInformationService = userReceivingInformationService;
    }
    userReceivingInformation(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const information = yield this.userReceivingInformationService.getUserReceivingInformation(id);
            return { code: 200, message: "获取指定用户收货信息成功", information };
        });
    }
    userReceivingInformations(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = body;
            if (!userId) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const informations = yield this.userReceivingInformationService.getUserReceivingInformations(userId);
            return { code: 200, message: "获取指定用户收货信息成功", informations };
        });
    }
    createUserReceivingInformation(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, consignee, email, region, address, postCode, homePhone, mobilePhone } = body;
            if (!userId || !consignee || !email || !region || !address || !postCode || !homePhone || !mobilePhone) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.userReceivingInformationService.createUserReceivingInformation(userId, consignee, email, region, address, postCode, homePhone, mobilePhone);
            return { code: 200, message: "创建用户收货信息成功" };
        });
    }
    updateUserReceivingInformation(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, consignee, email, region, address, postCode, homePhone, mobilePhone } = body;
            if (!id || !consignee || !email || !region || !address || !postCode || !homePhone || !mobilePhone) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.userReceivingInformationService.updateUserReceivingInformation(id, consignee, email, region, address, postCode, homePhone, mobilePhone);
            return { code: 200, message: "更新用户收货信息成功" };
        });
    }
    deleteUserReceivingInformation(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.userReceivingInformationService.deleteUserReceivingInformation(id);
            return { code: 200, message: "删除用户收货信息成功" };
        });
    }
};
__decorate([
    graphql_1.Query("userReceivingInformation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserReceivingInformationResolver.prototype, "userReceivingInformation", null);
__decorate([
    graphql_1.Query("userReceivingInformations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserReceivingInformationResolver.prototype, "userReceivingInformations", null);
__decorate([
    graphql_1.Mutation("createUserReceivingInformation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserReceivingInformationResolver.prototype, "createUserReceivingInformation", null);
__decorate([
    graphql_1.Mutation("updateUserReceivingInformation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserReceivingInformationResolver.prototype, "updateUserReceivingInformation", null);
__decorate([
    graphql_1.Mutation("deleteUserReceivingInformation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserReceivingInformationResolver.prototype, "deleteUserReceivingInformation", null);
UserReceivingInformationResolver = __decorate([
    graphql_1.Resolver("UserReceivingInformation"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(user_receiving_information_service_1.UserReceivingInformationService)),
    __metadata("design:paramtypes", [user_receiving_information_service_1.UserReceivingInformationService])
], UserReceivingInformationResolver);
exports.UserReceivingInformationResolver = UserReceivingInformationResolver;

//# sourceMappingURL=user.receiving.information.resolver.js.map
