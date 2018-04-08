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
let PageContentEntity = class PageContentEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PageContentEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PageContentEntity.prototype, "parentId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 10000 }),
    __metadata("design:type", String)
], PageContentEntity.prototype, "content", void 0);
__decorate([
    typeorm_1.ManyToOne(type => page_entity_1.PageEntity, page => page.contents, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false,
        nullable: true
    }),
    typeorm_1.JoinColumn({ name: 'parentId', referencedColumnName: 'id' }),
    __metadata("design:type", page_entity_1.PageEntity)
], PageContentEntity.prototype, "page", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], PageContentEntity.prototype, "createAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], PageContentEntity.prototype, "updateAt", void 0);
PageContentEntity = __decorate([
    typeorm_1.Entity('page_content_table')
], PageContentEntity);
exports.PageContentEntity = PageContentEntity;
