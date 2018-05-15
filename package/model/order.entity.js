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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_receiving_information_entity_1 = require("./user.receiving.information.entity");
const order_item_entity_1 = require("./order.item.entity");
const delivery_entity_1 = require("./delivery.entity");
let Order = class Order {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Order.prototype, "orderNo", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Order.prototype, "createDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Order.prototype, "updateDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Order.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({
        length: 30
    }),
    __metadata("design:type", String)
], Order.prototype, "delivertNo", void 0);
__decorate([
    typeorm_1.Column({
        type: "timestamp"
    }),
    __metadata("design:type", Date)
], Order.prototype, "delivertTime", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], Order.prototype, "invoiceType", void 0);
__decorate([
    typeorm_1.Column({
        length: 100
    }),
    __metadata("design:type", String)
], Order.prototype, "invoiceContent", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], Order.prototype, "invoiceTitle", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], Order.prototype, "customerMessage", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "deliveryId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "receivingInformationId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => delivery_entity_1.Delivery, {
        cascade: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", delivery_entity_1.Delivery)
], Order.prototype, "delivery", void 0);
__decorate([
    typeorm_1.OneToMany(type => order_item_entity_1.OrderItem, orderItem => orderItem.order, {
        cascade: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_receiving_information_entity_1.UserReceivingInformation, {
        cascade: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", user_receiving_information_entity_1.UserReceivingInformation)
], Order.prototype, "userReceivingInformation", void 0);
Order = __decorate([
    typeorm_1.Entity("order")
], Order);
exports.Order = Order;

//# sourceMappingURL=order.entity.js.map
