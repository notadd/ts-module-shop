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
const delivery_service_1 = require("../service/delivery.service");
const graphql_1 = require("@nestjs/graphql");
let DeliveryResolver = class DeliveryResolver {
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
    }
    deliveries(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliveries = yield this.deliveryService.getDeliveries();
            return { code: 200, message: "获取所有配送服务成功", deliveries };
        });
    }
    createDelivery(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, cost, freeLimit, valuationFee } = body;
            if (!name || !description || cost === undefined || cost === null || freeLimit === undefined || freeLimit === null || valuationFee === undefined || valuationFee === null) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.deliveryService.createDelivery(name, description, cost, freeLimit, valuationFee);
            return { code: 200, message: "创建配送信息成功" };
        });
    }
    updateDelivery(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, description, cost, freeLimit, valuationFee } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.deliveryService.updateDelivery(id, name, description, cost, freeLimit, valuationFee);
            return { code: 200, message: "更新配送信息成功" };
        });
    }
    deleteDelivery(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.deliveryService.deleteDelivery(id);
            return { code: 200, message: "删除配送信息成功" };
        });
    }
};
__decorate([
    graphql_1.Query("deliveries"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeliveryResolver.prototype, "deliveries", null);
__decorate([
    graphql_1.Mutation("createDelivery"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryResolver.prototype, "createDelivery", null);
__decorate([
    graphql_1.Mutation("updateDelivery"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryResolver.prototype, "updateDelivery", null);
__decorate([
    graphql_1.Mutation("deleteDelivery"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryResolver.prototype, "deleteDelivery", null);
DeliveryResolver = __decorate([
    graphql_1.Resolver("Delivery"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(delivery_service_1.DeliveryService)),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService])
], DeliveryResolver);
exports.DeliveryResolver = DeliveryResolver;
