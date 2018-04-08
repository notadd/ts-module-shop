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
let VisitEntity = class VisitEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], VisitEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], VisitEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], VisitEntity.prototype, "telPhone", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], VisitEntity.prototype, "WeChat", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 70 }),
    __metadata("design:type", String)
], VisitEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], VisitEntity.prototype, "companyName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 130 }),
    __metadata("design:type", String)
], VisitEntity.prototype, "industryInvolved", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 30 }),
    __metadata("design:type", String)
], VisitEntity.prototype, "employees", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], VisitEntity.prototype, "appointmentDate", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], VisitEntity.prototype, "collapse", void 0);
VisitEntity = __decorate([
    typeorm_1.Entity('visit-appointment-table')
], VisitEntity);
exports.VisitEntity = VisitEntity;
