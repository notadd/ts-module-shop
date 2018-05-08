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
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const user_1 = require("@notadd/user");
const order_item_entity_1 = require("../model/order.item.entity");
const typeorm_2 = require("@nestjs/typeorm");
const sku_entity_1 = require("../model/sku.entity");
let OrderItemService = class OrderItemService {
    constructor(skuRepository, userComponent, orderItemRepository) {
        this.skuRepository = skuRepository;
        this.userComponent = userComponent;
        this.orderItemRepository = orderItemRepository;
    }
    findCartItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItems = yield this.orderItemRepository.createQueryBuilder("item")
                .where({ userId })
                .leftJoinAndSelect("item.sku", "sku")
                .leftJoinAndSelect("item.order", "order")
                .getMany();
            return cartItems.filter(item => !item.order);
        });
    }
    findOrderItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderItem = yield this.orderItemRepository.createQueryBuilder("item")
                .where({ id })
                .leftJoinAndSelect("item.sku", "sku")
                .leftJoinAndSelect("item.order", "order")
                .getOne();
            return orderItem;
        });
    }
    createOrderItem(count, skuId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userComponent.getUserById(userId);
            if (!user) {
                throw new common_1.HttpException("指定id=" + userId + "用户不存在", 404);
            }
            const sku = yield this.skuRepository.findOneById(skuId);
            if (!sku) {
                throw new common_1.HttpException("指定id=" + skuId + "Sku不存在", 404);
            }
            try {
                yield this.orderItemRepository.save({ count, userId, sku });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateOrderItem(id, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.orderItemRepository.findOneById(id);
            if (!item) {
                throw new common_1.HttpException("指定id=" + id + "订单项不存在", 404);
            }
            item.count = count;
            try {
                yield this.orderItemRepository.save(item);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteOrderItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.orderItemRepository.findOneById(id);
            if (!item) {
                throw new common_1.HttpException("指定id=" + id + "订单项不存在", 404);
            }
            try {
                yield this.orderItemRepository.remove(item);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
OrderItemService = __decorate([
    common_1.Component(),
    __param(0, typeorm_2.InjectRepository(sku_entity_1.Sku)),
    __param(1, common_1.Inject(user_1.UserComponentToken)),
    __param(2, typeorm_2.InjectRepository(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        user_1.UserComponent,
        typeorm_1.Repository])
], OrderItemService);
exports.OrderItemService = OrderItemService;
