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
const page_content_entity_1 = require("./page.content.entity");
const pageClassify_entity_1 = require("./pageClassify.entity");
let PageEntity = class PageEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PageEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 200 }),
    __metadata("design:type", String)
], PageEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ length: 200, nullable: true }),
    __metadata("design:type", String)
], PageEntity.prototype, "alias", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], PageEntity.prototype, "classifyId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], PageEntity.prototype, "classify", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], PageEntity.prototype, "createAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], PageEntity.prototype, "updateAt", void 0);
__decorate([
    typeorm_1.OneToMany(type => page_content_entity_1.PageContentEntity, PageContentEntity => PageContentEntity.page),
    __metadata("design:type", Array)
], PageEntity.prototype, "contents", void 0);
__decorate([
    typeorm_1.OneToMany(type => pageClassify_entity_1.PageClassifyEntity, PageClassifyEntity => PageClassifyEntity.pages),
    __metadata("design:type", Array)
], PageEntity.prototype, "classifications", void 0);
PageEntity = __decorate([
    typeorm_1.Entity('page_entity_table')
], PageEntity);
exports.PageEntity = PageEntity;
class Page {
}
exports.Page = Page;
