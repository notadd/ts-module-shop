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
const evaluation_entity_1 = require("./evaluation.entity");
let EvaluationImage = class EvaluationImage {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], EvaluationImage.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], EvaluationImage.prototype, "bucketName", void 0);
__decorate([
    typeorm_1.Column({
        length: 100
    }),
    __metadata("design:type", String)
], EvaluationImage.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        length: 20
    }),
    __metadata("design:type", String)
], EvaluationImage.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], EvaluationImage.prototype, "evaluationId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => evaluation_entity_1.Evaluation, evaluation => evaluation.images, {
        cascade: false,
        onDelete: "CASCADE",
        nullable: true,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", evaluation_entity_1.Evaluation)
], EvaluationImage.prototype, "evaluation", void 0);
EvaluationImage = __decorate([
    typeorm_1.Entity("evaluation_image")
], EvaluationImage);
exports.EvaluationImage = EvaluationImage;

//# sourceMappingURL=evaluation.image.entity.js.map
