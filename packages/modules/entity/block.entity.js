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
let BlockEntity = class BlockEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BlockEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], BlockEntity.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], BlockEntity.prototype, "telPhone", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], BlockEntity.prototype, "WeChat", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 70 }),
    __metadata("design:type", String)
], BlockEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], BlockEntity.prototype, "companyName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 130 }),
    __metadata("design:type", String)
], BlockEntity.prototype, "industryInvolved", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 30 }),
    __metadata("design:type", String)
], BlockEntity.prototype, "employees", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 700 }),
    __metadata("design:type", String)
], BlockEntity.prototype, "companyIntroduction", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], BlockEntity.prototype, "collapse", void 0);
BlockEntity = __decorate([
    typeorm_1.Entity('block-entry-form')
], BlockEntity);
exports.BlockEntity = BlockEntity;
