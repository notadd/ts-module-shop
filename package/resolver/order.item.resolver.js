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
const order_item_service_1 = require("../service/order.item.service");
const graphql_1 = require("@nestjs/graphql");
let OrderItemResolver = class OrderItemResolver {
    constructor(orderItemService) {
        this.orderItemService = orderItemService;
    }
    cartItems(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = body;
            if (!userId) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const cartItems = yield this.orderItemService.findCartItems(userId);
            return { code: 200, message: "获取指定用户购物车订单项成功", cartItems };
        });
    }
    orderItem(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const orderItem = yield this.orderItemService.findOrderItem(id);
            return { code: 200, message: "获取指定id订单项成功", orderItem };
        });
    }
    createOrderItem(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { count, skuId, userId } = body;
            if (!count || !skuId || !userId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            if (count <= 0) {
                throw new common_1.HttpException("商品数量必须大于0", 400);
            }
            yield this.orderItemService.createOrderItem(count, skuId, userId);
            return { code: 200, message: "创建订单项成功" };
        });
    }
    updateOrderItem(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, count } = body;
            if (!id || !count) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            if (count <= 0) {
                throw new common_1.HttpException("商品数量必须大于0", 400);
            }
            yield this.orderItemService.updateOrderItem(id, count);
            return { code: 200, message: "更新订单项成功" };
        });
    }
    deleteOrderItem(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.orderItemService.deleteOrderItem(id);
            return { code: 200, message: "删除订单项成功" };
        });
    }
};
__decorate([
    graphql_1.Query("cartItems"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderItemResolver.prototype, "cartItems", null);
__decorate([
    graphql_1.Query("orderItem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderItemResolver.prototype, "orderItem", null);
__decorate([
    graphql_1.Mutation("createOrderItem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderItemResolver.prototype, "createOrderItem", null);
__decorate([
    graphql_1.Mutation("updateOrderItem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderItemResolver.prototype, "updateOrderItem", null);
__decorate([
    graphql_1.Mutation("deleteOrderItem"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderItemResolver.prototype, "deleteOrderItem", null);
OrderItemResolver = __decorate([
    graphql_1.Resolver("OrderItem"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(order_item_service_1.OrderItemService)),
    __metadata("design:paramtypes", [order_item_service_1.OrderItemService])
], OrderItemResolver);
exports.OrderItemResolver = OrderItemResolver;
