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
const Bucket_1 = require("./Bucket");
let ImageConfig = class ImageConfig {
};
__decorate([
    typeorm_1.PrimaryColumn({
        name: 'id',
        type: 'integer'
    }),
    __metadata("design:type", Number)
], ImageConfig.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'format',
        type: 'varchar',
        nullable: true
    }),
    __metadata("design:type", String)
], ImageConfig.prototype, "format", void 0);
__decorate([
    typeorm_1.Column({
        name: 'watermark_enable',
        type: 'smallint',
        nullable: true
    }),
    __metadata("design:type", Number)
], ImageConfig.prototype, "watermark_enable", void 0);
__decorate([
    typeorm_1.Column({
        name: 'watermark_save_key',
        type: 'varchar',
        length: 200,
        nullable: true
    }),
    __metadata("design:type", String)
], ImageConfig.prototype, "watermark_save_key", void 0);
__decorate([
    typeorm_1.Column({
        name: 'watermark_gravity',
        type: 'varchar',
        nullable: true
    }),
    __metadata("design:type", String)
], ImageConfig.prototype, "watermark_gravity", void 0);
__decorate([
    typeorm_1.Column({
        name: 'watermark_x',
        type: 'integer',
        nullable: true
    }),
    __metadata("design:type", Number)
], ImageConfig.prototype, "watermark_x", void 0);
__decorate([
    typeorm_1.Column({
        name: 'watermark_y',
        type: 'integer',
        nullable: true
    }),
    __metadata("design:type", Number)
], ImageConfig.prototype, "watermark_y", void 0);
__decorate([
    typeorm_1.Column({
        name: 'watermark_opacity',
        type: 'integer',
        nullable: true
    }),
    __metadata("design:type", Number)
], ImageConfig.prototype, "watermark_opacity", void 0);
__decorate([
    typeorm_1.Column({
        name: 'watermark_ws',
        type: 'integer',
        nullable: true
    }),
    __metadata("design:type", Number)
], ImageConfig.prototype, "watermark_ws", void 0);
__decorate([
    typeorm_1.OneToOne(type => Bucket_1.Bucket, bucket => bucket.image_config),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Bucket_1.Bucket)
], ImageConfig.prototype, "bucket", void 0);
ImageConfig = __decorate([
    typeorm_1.Entity({
        name: 'image_config'
    })
], ImageConfig);
exports.ImageConfig = ImageConfig;
