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
const order_item_entity_1 = require("../model/order.item.entity");
const delivery_entity_1 = require("../model/delivery.entity");
const typeorm_2 = require("@nestjs/typeorm");
const random_util_1 = require("../util/random.util");
const order_entity_1 = require("../model/order.entity");
const date_util_1 = require("../util/date.util");
const sku_entity_1 = require("../model/sku.entity");
let OrderService = class OrderService {
    constructor(dateUtil, connection, randomUtil, skuRepository, userComponent, orderRepository, orderItemRepository, deliveryRepository, userReceivingInformationRepository) {
        this.dateUtil = dateUtil;
        this.connection = connection;
        this.randomUtil = randomUtil;
        this.skuRepository = skuRepository;
        this.userComponent = userComponent;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.deliveryRepository = deliveryRepository;
        this.userReceivingInformationRepository = userReceivingInformationRepository;
    }
    getOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orderRepository.createQueryBuilder("order")
                .leftJoinAndSelect("order.items", "item")
                .leftJoinAndSelect("order.delivery", "delivery")
                .leftJoinAndSelect("order.userReceivingInformation", "userReceivingInformation")
                .getMany();
            return orders;
        });
    }
    getOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.createQueryBuilder("order")
                .leftJoinAndSelect("order.items", "item")
                .leftJoinAndSelect("order.delivery", "delivery")
                .leftJoinAndSelect("order.userReceivingInformation", "userReceivingInformation")
                .getOne();
            return order;
        });
    }
    createOrder(userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userComponent.getUserById(userId);
            if (!user) {
                throw new common_1.HttpException("指定id=" + userId + "用户不存在", 404);
            }
            const delivery = yield this.deliveryRepository.findOneById(deliveryId);
            if (!delivery) {
                throw new common_1.HttpException("指定id=" + deliveryId + "配送信息不存在", 404);
            }
            const userReceivingInformation = yield this.userReceivingInformationRepository.findOneById(userReceivingInformationId);
            if (!userReceivingInformation) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const orderNo = this.dateUtil.getString(new Date()) + this.randomUtil.getRandom(18);
            for (let i = 0; i < items.length; i++) {
                const sku = yield this.skuRepository.findOneById(items[i].skuId);
                if (!sku) {
                    throw new common_1.HttpException("指定id=" + items[i].skuId + "Sku不存在", 404);
                }
                if (sku.inventory < items[i].count) {
                    throw new common_1.HttpException("商品库存小于购买数量", 404);
                }
                items[i].userId = userId;
                items[i].sku = sku;
            }
            const queryRunner = this.connection.createQueryRunner("master");
            yield queryRunner.startTransaction();
            try {
                for (let i = 0; i < items.length; i++) {
                    items[i].sku.inventory -= items[i].count;
                    yield queryRunner.manager.save(items[i].sku);
                }
                yield queryRunner.manager.save({ orderNo, userId, delivertNo, delivertTime: new Date(delivertTime), invoiceType, invoiceContent, invoiceTitle, customerMessage, delivery, userReceivingInformation, items });
                yield queryRunner.commitTransaction();
            }
            catch (err) {
                yield queryRunner.rollbackTransaction();
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    createOrderFromCart(userId, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId, itemIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userComponent.getUserById(userId);
            if (!user) {
                throw new common_1.HttpException("指定id=" + userId + "用户不存在", 404);
            }
            const delivery = yield this.deliveryRepository.findOneById(deliveryId);
            if (!delivery) {
                throw new common_1.HttpException("指定id=" + deliveryId + "配送信息不存在", 404);
            }
            const userReceivingInformation = yield this.userReceivingInformationRepository.findOneById(userReceivingInformationId);
            if (!userReceivingInformation) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const orderNo = this.dateUtil.getString(new Date()) + this.randomUtil.getRandom(18);
            const items = yield this.orderItemRepository.findByIds(itemIds, { relations: ["order"] });
            itemIds.forEach(id => {
                const item = items.find(i => i.id === id);
                if (!item) {
                    throw new common_1.HttpException("指定id=" + id + "订单项不存在", 404);
                }
                if (item.userId !== userId) {
                    throw new common_1.HttpException("指定订单项不属于指定id=" + userId + "用户", 404);
                }
                if (item.order) {
                    throw new common_1.HttpException("指定订单项id=" + id + "已属于订单", 404);
                }
            });
            const queryRunner = this.connection.createQueryRunner("master");
            yield queryRunner.startTransaction();
            try {
                for (let i = 0; i < items.length; i++) {
                    items[i].sku.inventory -= items[i].count;
                    yield queryRunner.manager.save(items[i].sku);
                }
                yield queryRunner.manager.save({ orderNo, userId, delivertNo, delivertTime: new Date(delivertTime), invoiceType, invoiceContent, invoiceTitle, customerMessage, delivery, userReceivingInformation, items });
                yield queryRunner.commitTransaction();
            }
            catch (err) {
                yield queryRunner.rollbackTransaction();
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    updateOrder(id, delivertNo, delivertTime, invoiceType, invoiceContent, invoiceTitle, customerMessage, deliveryId, userReceivingInformationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findOneById(id);
            if (!order) {
                throw new common_1.HttpException("指定id=" + id + "订单不存在", 404);
            }
            const delivery = yield this.deliveryRepository.findOneById(deliveryId);
            if (!delivery) {
                throw new common_1.HttpException("指定id=" + deliveryId + "配送信息不存在", 404);
            }
            const userReceivingInformation = yield this.userReceivingInformationRepository.findOneById(userReceivingInformationId);
            if (!userReceivingInformation) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            order.delivertNo = delivertNo;
            order.delivertTime = new Date(delivertTime);
            order.invoiceType = invoiceType;
            order.invoiceContent = invoiceContent;
            order.invoiceTitle = invoiceTitle;
            order.customerMessage = customerMessage;
            order.delivery = delivery;
            order.userReceivingInformation = userReceivingInformation;
            try {
                yield this.orderRepository.save(order);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findOneById(id);
            if (!order) {
                throw new common_1.HttpException("指定id=" + id + "订单不存在", 404);
            }
            try {
                yield this.orderRepository.remove(order);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
OrderService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject(date_util_1.DateUtil)),
    __param(1, common_1.Inject(typeorm_1.Connection)),
    __param(2, common_1.Inject(random_util_1.RandomUtil)),
    __param(3, typeorm_2.InjectRepository(sku_entity_1.Sku)),
    __param(4, common_1.Inject("UserComponentToken")),
    __param(5, typeorm_2.InjectRepository(order_entity_1.Order)),
    __param(6, typeorm_2.InjectRepository(order_item_entity_1.OrderItem)),
    __param(7, typeorm_2.InjectRepository(delivery_entity_1.Delivery)),
    __param(8, typeorm_2.InjectRepository(user_receiving_information_entity_1.UserReceivingInformation)),
    __metadata("design:paramtypes", [date_util_1.DateUtil,
        typeorm_1.Connection,
        random_util_1.RandomUtil,
        typeorm_1.Repository, Object, typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], OrderService);
exports.OrderService = OrderService;
