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
const graphql_1 = require("@nestjs/graphql");
const order_service_1 = require("../service/order.service");
let OrderResolver = class OrderResolver {
    constructor(orderService) {
        this.orderService = orderService;
    }
    order(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const order = yield this.orderService.getOrder(id);
            return { code: 200, message: "获取指定订单成功", order };
        });
    }
    orders(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orderService.getOrders();
            return { code: 200, message: "获取所有订单成功", orders };
        });
    }
    createOrder(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, items } = body;
            if (!userId || !delivertNo || !delivertTime || !invoiceType || !invoiceContent || !invoiceTitle || !customerMessage || !deliveryId || !userReceivingInformationId || !items || items.length === 0) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.orderService.createOrder(userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, items);
            return { code: 200, message: "创建订单成功" };
        });
    }
    createOrderFromCart(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, itemIds } = body;
            if (!userId || !delivertNo || !delivertTime || !invoiceType || !invoiceContent || !invoiceTitle || !customerMessage || !deliveryId || !userReceivingInformationId || !itemIds || itemIds.length === 0) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.orderService.createOrderFromCart(userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, itemIds);
            return { code: 200, message: "从购物车创建订单成功" };
        });
    }
    updateOrder(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId } = body;
            if (!id || !delivertNo || !delivertTime || !invoiceType || !invoiceContent || !invoiceTitle || !customerMessage || !deliveryId || !userReceivingInformationId) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.orderService.updateOrder(id, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId);
            return { code: 200, message: "更新订单成功" };
        });
    }
    deleteOrder(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.orderService.deleteOrder(id);
            return { code: 200, message: "删除订单成功" };
        });
    }
};
__decorate([
    graphql_1.Query("order"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "order", null);
__decorate([
    graphql_1.Query("orders"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "orders", null);
__decorate([
    graphql_1.Mutation("createOrder"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "createOrder", null);
__decorate([
    graphql_1.Mutation("createOrderFromCart"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "createOrderFromCart", null);
__decorate([
    graphql_1.Mutation("updateOrder"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "updateOrder", null);
__decorate([
    graphql_1.Mutation("deleteOrder"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "deleteOrder", null);
OrderResolver = __decorate([
    graphql_1.Resolver("Order"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(order_service_1.OrderService)),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderResolver);
exports.OrderResolver = OrderResolver;

//# sourceMappingURL=order.resolver.js.map
