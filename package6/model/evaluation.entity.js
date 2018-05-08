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
const order_item_entity_1 = require("./order.item.entity");
const user_1 = require("@notadd/user");
let Evaluation = class Evaluation {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Evaluation.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 200 }),
    __metadata("design:type", String)
], Evaluation.prototype, "content", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Evaluation.prototype, "display", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", Number)
], Evaluation.prototype, "userId", void 0);
__decorate([
    typeorm_1.OneToOne(type => user_1.User, {
        cascadeAll: false,
        nullable: false,
        lazy: false,
        eager: false,
        onDelete: "CASCADE"
    }),
    typeorm_1.JoinColumn({
        name: "userId",
        referencedColumnName: "id"
    }),
    __metadata("design:type", user_1.User)
], Evaluation.prototype, "user", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", Number)
], Evaluation.prototype, "orderItemId", void 0);
__decorate([
    typeorm_1.OneToOne(type => order_item_entity_1.OrderItem, {
        cascadeAll: false,
        nullable: false,
        lazy: false,
        eager: false,
        onDelete: "CASCADE"
    }),
    typeorm_1.JoinColumn({
        name: "orderItemId",
        referencedColumnName: "id"
    }),
    __metadata("design:type", order_item_entity_1.OrderItem)
], Evaluation.prototype, "orderItem", void 0);
Evaluation = __decorate([
    typeorm_1.Entity("evaluation")
], Evaluation);
exports.Evaluation = Evaluation;
