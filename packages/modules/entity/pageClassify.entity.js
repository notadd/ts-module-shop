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
const page_entity_1 = require("./page.entity");
let PageClassifyEntity = PageClassifyEntity_1 = class PageClassifyEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PageClassifyEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, length: 120 }),
    __metadata("design:type", String)
], PageClassifyEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, length: 120 }),
    __metadata("design:type", String)
], PageClassifyEntity.prototype, "classifyAlias", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], PageClassifyEntity.prototype, "chainUrl", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], PageClassifyEntity.prototype, "describe", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 40 }),
    __metadata("design:type", String)
], PageClassifyEntity.prototype, "color", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], PageClassifyEntity.prototype, "groupId", void 0);
__decorate([
    typeorm_1.OneToMany(type => PageClassifyEntity_1, PageClassifyEntity => PageClassifyEntity.parent, { cascadeInsert: true }),
    __metadata("design:type", Array)
], PageClassifyEntity.prototype, "children", void 0);
__decorate([
    typeorm_1.ManyToOne(type => PageClassifyEntity_1, PageClassifyEntity => PageClassifyEntity.children, { cascadeInsert: true }),
    __metadata("design:type", PageClassifyEntity)
], PageClassifyEntity.prototype, "parent", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], PageClassifyEntity.prototype, "createAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], PageClassifyEntity.prototype, "updateAt", void 0);
__decorate([
    typeorm_1.ManyToOne(type => page_entity_1.PageEntity, PageEntity => PageEntity.classifications),
    __metadata("design:type", page_entity_1.PageEntity)
], PageClassifyEntity.prototype, "pages", void 0);
PageClassifyEntity = PageClassifyEntity_1 = __decorate([
    typeorm_1.Entity('page_classify_table')
], PageClassifyEntity);
exports.PageClassifyEntity = PageClassifyEntity;
var PageClassifyEntity_1;
