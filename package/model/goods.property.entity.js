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
const goods_type_entity_1 = require("./goods.type.entity");
let GoodsProperty = class GoodsProperty {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], GoodsProperty.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], GoodsProperty.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], GoodsProperty.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], GoodsProperty.prototype, "inputType", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-array",
        nullable: true
    }),
    __metadata("design:type", Array)
], GoodsProperty.prototype, "list", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], GoodsProperty.prototype, "goodsTypeId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => goods_type_entity_1.GoodsType, goodsType => goodsType.properties, {
        cascade: false,
        onDelete: "CASCADE",
        nullable: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", goods_type_entity_1.GoodsType)
], GoodsProperty.prototype, "goodsType", void 0);
__decorate([
    typeorm_1.OneToMany(type => property_value_entity_1.PropertyValue, propertyValue => propertyValue.property, {
        cascade: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], GoodsProperty.prototype, "values", void 0);
GoodsProperty = __decorate([
    typeorm_1.Entity("goods_property"),
    typeorm_1.Index("name_type_id", ["name", "goodsTypeId"])
], GoodsProperty);
exports.GoodsProperty = GoodsProperty;

//# sourceMappingURL=goods.property.entity.js.map
