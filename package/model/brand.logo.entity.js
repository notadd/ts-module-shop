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
const brand_entity_1 = require("./brand.entity");
let BrandLogo = class BrandLogo {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BrandLogo.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], BrandLogo.prototype, "bucketName", void 0);
__decorate([
    typeorm_1.Column({
        length: 100
    }),
    __metadata("design:type", String)
], BrandLogo.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], BrandLogo.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], BrandLogo.prototype, "brandId", void 0);
__decorate([
    typeorm_1.OneToOne(type => brand_entity_1.Brand, brand => brand.logo, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "CASCADE",
        nullable: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinColumn({
        name: "brandId",
        referencedColumnName: "id"
    }),
    __metadata("design:type", brand_entity_1.Brand)
], BrandLogo.prototype, "brand", void 0);
BrandLogo = __decorate([
    typeorm_1.Entity("brand_logo"),
    typeorm_1.Index("brand_id", ["brandId"])
], BrandLogo);
exports.BrandLogo = BrandLogo;
