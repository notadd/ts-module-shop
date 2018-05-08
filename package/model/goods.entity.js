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
const third_classify_entity_1 = require("./third.classify.entity");
const goods_image_entity_1 = require("./goods.image.entity");
const goods_type_entity_1 = require("./goods.type.entity");
const floor_entity_1 = require("./floor.entity");
const brand_entity_1 = require("./brand.entity");
const sku_entity_1 = require("./sku.entity");
let Goods = class Goods {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Goods.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 50,
        unique: true
    }),
    __metadata("design:type", String)
], Goods.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        length: 50
    }),
    __metadata("design:type", String)
], Goods.prototype, "no", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 10,
        scale: 2
    }),
    __metadata("design:type", Number)
], Goods.prototype, "basePrice", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: true
    }),
    __metadata("design:type", Number)
], Goods.prototype, "discountPrice", void 0);
__decorate([
    typeorm_1.Column({
        type: "text"
    }),
    __metadata("design:type", String)
], Goods.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Goods.prototype, "recycle", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Goods.prototype, "classifyId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Goods.prototype, "typeId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => third_classify_entity_1.ThirdClassify, thirdClassify => thirdClassify.goodses, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", third_classify_entity_1.ThirdClassify)
], Goods.prototype, "classify", void 0);
__decorate([
    typeorm_1.ManyToOne(type => brand_entity_1.Brand, brand => brand.goodses, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: true,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", brand_entity_1.Brand)
], Goods.prototype, "brand", void 0);
__decorate([
    typeorm_1.ManyToOne(type => goods_type_entity_1.GoodsType, goodsType => goodsType.goodses, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", goods_type_entity_1.GoodsType)
], Goods.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToMany(type => floor_entity_1.Floor, floor => floor.goodses, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Goods.prototype, "floors", void 0);
__decorate([
    typeorm_1.OneToMany(type => property_value_entity_1.PropertyValue, propertyValue => propertyValue.goods, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Goods.prototype, "values", void 0);
__decorate([
    typeorm_1.OneToMany(type => goods_image_entity_1.GoodsImage, goodsImage => goodsImage.goods, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Goods.prototype, "images", void 0);
__decorate([
    typeorm_1.OneToMany(type => sku_entity_1.Sku, sku => sku.goods, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Goods.prototype, "skus", void 0);
Goods = __decorate([
    typeorm_1.Entity("goods")
], Goods);
exports.Goods = Goods;
