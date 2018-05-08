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
let UserReceivingInformation = class UserReceivingInformation {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserReceivingInformation.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], UserReceivingInformation.prototype, "consignee", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], UserReceivingInformation.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        length: 50
    }),
    __metadata("design:type", String)
], UserReceivingInformation.prototype, "region", void 0);
__decorate([
    typeorm_1.Column({
        length: 50
    }),
    __metadata("design:type", String)
], UserReceivingInformation.prototype, "address", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], UserReceivingInformation.prototype, "postCode", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], UserReceivingInformation.prototype, "homePhone", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], UserReceivingInformation.prototype, "mobilePhone", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserReceivingInformation.prototype, "userId", void 0);
UserReceivingInformation = __decorate([
    typeorm_1.Entity("user_receiving_information")
], UserReceivingInformation);
exports.UserReceivingInformation = UserReceivingInformation;
