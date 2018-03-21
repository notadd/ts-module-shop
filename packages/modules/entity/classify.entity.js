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
const article_entity_1 = require("./article.entity");
let ClassifyEntity = ClassifyEntity_1 = class ClassifyEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ClassifyEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, length: 120 }),
    __metadata("design:type", String)
], ClassifyEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, length: 120 }),
    __metadata("design:type", String)
], ClassifyEntity.prototype, "classifyAlias", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], ClassifyEntity.prototype, "chainUrl", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], ClassifyEntity.prototype, "describe", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 40 }),
    __metadata("design:type", String)
], ClassifyEntity.prototype, "color", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ClassifyEntity.prototype, "groupId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ClassifyEntity.prototype, "level", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], ClassifyEntity.prototype, "isCurrentType", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], ClassifyEntity.prototype, "isChildType", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], ClassifyEntity.prototype, "isAllTop", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], ClassifyEntity.prototype, "isPreTop", void 0);
__decorate([
    typeorm_1.OneToMany(type => ClassifyEntity_1, ClassifyEntity => ClassifyEntity.parent, { cascadeInsert: true }),
    __metadata("design:type", Array)
], ClassifyEntity.prototype, "children", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ClassifyEntity_1, ClassifyEntity => ClassifyEntity.children, { cascadeInsert: true }),
    __metadata("design:type", ClassifyEntity)
], ClassifyEntity.prototype, "parent", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ClassifyEntity.prototype, "createAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ClassifyEntity.prototype, "updateAt", void 0);
__decorate([
    typeorm_1.ManyToOne(type => article_entity_1.ArticleEntity, ArticleEntity => ArticleEntity.classifications),
    __metadata("design:type", article_entity_1.ArticleEntity)
], ClassifyEntity.prototype, "articles", void 0);
ClassifyEntity = ClassifyEntity_1 = __decorate([
    typeorm_1.Entity('article_classify_table')
], ClassifyEntity);
exports.ClassifyEntity = ClassifyEntity;
var ClassifyEntity_1;
