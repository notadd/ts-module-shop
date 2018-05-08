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
const first_classify_entity_1 = require("./first.classify.entity");
const third_classify_entity_1 = require("./third.classify.entity");
let SecondClassify = class SecondClassify {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SecondClassify.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 20,
        unique: true
    }),
    __metadata("design:type", String)
], SecondClassify.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        length: 100
    }),
    __metadata("design:type", String)
], SecondClassify.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        default: 2
    }),
    __metadata("design:type", Number)
], SecondClassify.prototype, "level", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SecondClassify.prototype, "parentId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => first_classify_entity_1.FirstClassify, firstClassify => firstClassify.children, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", first_classify_entity_1.FirstClassify)
], SecondClassify.prototype, "parent", void 0);
__decorate([
    typeorm_1.OneToMany(type => third_classify_entity_1.ThirdClassify, thirdClassify => thirdClassify.parent, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], SecondClassify.prototype, "children", void 0);
SecondClassify = __decorate([
    typeorm_1.Entity("second_classify")
], SecondClassify);
exports.SecondClassify = SecondClassify;
