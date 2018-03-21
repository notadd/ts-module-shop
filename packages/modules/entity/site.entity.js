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
let SiteEntity = class SiteEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SiteEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "applicant", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "telPhone", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 160 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "activityName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], SiteEntity.prototype, "eventDate", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], SiteEntity.prototype, "startTime", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], SiteEntity.prototype, "endTime", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "peopleScale", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "siteSelection", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 150 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "equipment", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 700 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "activityIntroduce", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 600 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "mainGuest", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "plansMedia", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 700 }),
    __metadata("design:type", String)
], SiteEntity.prototype, "descr", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], SiteEntity.prototype, "collapse", void 0);
SiteEntity = __decorate([
    typeorm_1.Entity('site-rental-table')
], SiteEntity);
exports.SiteEntity = SiteEntity;
