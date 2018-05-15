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
let Member = class Member {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Member.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 20, unique: true }),
    __metadata("design:type", String)
], Member.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ length: 20 }),
    __metadata("design:type", String)
], Member.prototype, "realName", void 0);
__decorate([
    typeorm_1.Column({ length: 20 }),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ length: 10 }),
    __metadata("design:type", String)
], Member.prototype, "sex", void 0);
__decorate([
    typeorm_1.Column({ length: 30 }),
    __metadata("design:type", String)
], Member.prototype, "idNumber", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Member.prototype, "birthday", void 0);
__decorate([
    typeorm_1.Column({ length: 20 }),
    __metadata("design:type", String)
], Member.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ length: 20 }),
    __metadata("design:type", String)
], Member.prototype, "mobilePhone", void 0);
Member = __decorate([
    typeorm_1.Entity("member")
], Member);
exports.Member = Member;

//# sourceMappingURL=member.entity.js.map
