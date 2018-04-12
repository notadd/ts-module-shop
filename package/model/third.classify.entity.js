﻿"use strict";
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
const second_classify_entity_1 = require("./second.classify.entity");
const goods_entity_1 = require("./goods.entity");
let ThirdClassify = class ThirdClassify {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "integer", name: "id" }),
    __metadata("design:type", Number)
], ThirdClassify.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "name",
        type: "varchar",
        length: 20,
        unique: true
    }),
    __metadata("design:type", String)
], ThirdClassify.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: "description",
        type: "varchar",
        length: 100
    }),
    __metadata("design:type", String)
], ThirdClassify.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        name: "level",
        type: "integer",
        default: 3
    }),
    __metadata("design:type", Number)
], ThirdClassify.prototype, "level", void 0);
__decorate([
    typeorm_1.ManyToOne(type => second_classify_entity_1.SecondClassify, secondClassify => secondClassify.children, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", second_classify_entity_1.SecondClassify)
], ThirdClassify.prototype, "parent", void 0);
__decorate([
    typeorm_1.OneToMany(type => goods_entity_1.Goods, goods => goods.classify, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], ThirdClassify.prototype, "goodses", void 0);
ThirdClassify = __decorate([
    typeorm_1.Entity("third_classify")
], ThirdClassify);
exports.ThirdClassify = ThirdClassify;
//# sourceMappingURL=third.classify.entity.js.map