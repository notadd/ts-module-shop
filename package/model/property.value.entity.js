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
const goods_property_entity_1 = require("./goods.property.entity");
const goods_entity_1 = require("./goods.entity");
let PropertyValue = class PropertyValue {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: "id", type: "integer" }),
    __metadata("design:type", Number)
], PropertyValue.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "value",
        type: "varchar",
        length: 20
    }),
    __metadata("design:type", String)
], PropertyValue.prototype, "value", void 0);
__decorate([
    typeorm_1.Column({
        name: "price",
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: true
    }),
    __metadata("design:type", Number)
], PropertyValue.prototype, "price", void 0);
__decorate([
    typeorm_1.ManyToOne(type => goods_property_entity_1.GoodsProperty, goodsProperty => goodsProperty.values, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "CASCADE",
        nullable: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", goods_property_entity_1.GoodsProperty)
], PropertyValue.prototype, "property", void 0);
__decorate([
    typeorm_1.ManyToOne(type => goods_entity_1.Goods, goods => goods.values, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "CASCADE",
        nullable: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", goods_entity_1.Goods)
], PropertyValue.prototype, "goods", void 0);
PropertyValue = __decorate([
    typeorm_1.Entity("property_value")
], PropertyValue);
exports.PropertyValue = PropertyValue;
