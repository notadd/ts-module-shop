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
const property_value_entity_1 = require("./property.value.entity");
const goods_entity_1 = require("./goods.entity");
let Sku = class Sku {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Sku.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Sku.prototype, "no", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Sku.prototype, "inventory", void 0);
__decorate([
    typeorm_1.ManyToMany(type => property_value_entity_1.PropertyValue, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Sku.prototype, "values", void 0);
__decorate([
    typeorm_1.ManyToOne(type => goods_entity_1.Goods, goods => goods.skus, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", goods_entity_1.Goods)
], Sku.prototype, "goods", void 0);
Sku = __decorate([
    typeorm_1.Entity("sku")
], Sku);
exports.Sku = Sku;
