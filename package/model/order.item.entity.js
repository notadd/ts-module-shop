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
const evaluation_entity_1 = require("./evaluation.entity");
const order_entity_1 = require("./order.entity");
const sku_entity_1 = require("./sku.entity");
let OrderItem = class OrderItem {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], OrderItem.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OrderItem.prototype, "count", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OrderItem.prototype, "skuId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OrderItem.prototype, "userId", void 0);
__decorate([
    typeorm_1.OneToOne(type => evaluation_entity_1.Evaluation, evaluation => evaluation.orderItem, {
        cascade: false,
        lazy: false,
        eager: false,
        nullable: true
    }),
    __metadata("design:type", evaluation_entity_1.Evaluation)
], OrderItem.prototype, "evaluation", void 0);
__decorate([
    typeorm_1.ManyToOne(type => order_entity_1.Order, order => order.orderItems, {
        cascade: false,
        lazy: false,
        eager: false,
        nullable: true
    }),
    __metadata("design:type", order_entity_1.Order)
], OrderItem.prototype, "order", void 0);
__decorate([
    typeorm_1.ManyToOne(type => sku_entity_1.Sku, sku => sku.orderItems, {
        cascade: false,
        onDelete: "RESTRICT",
        lazy: false,
        eager: false
    }),
    __metadata("design:type", sku_entity_1.Sku)
], OrderItem.prototype, "sku", void 0);
OrderItem = __decorate([
    typeorm_1.Entity("order_item")
], OrderItem);
exports.OrderItem = OrderItem;

//# sourceMappingURL=order.item.entity.js.map
