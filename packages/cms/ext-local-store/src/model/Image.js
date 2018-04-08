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
const AbstractFile_1 = require("./AbstractFile");
const Bucket_1 = require("./Bucket");
let Image = class Image extends AbstractFile_1.AbstractFile {
};
__decorate([
    typeorm_1.Column({
        name: 'width',
        type: 'integer',
        nullable: true
    }),
    __metadata("design:type", Number)
], Image.prototype, "width", void 0);
__decorate([
    typeorm_1.Column({
        name: 'height',
        type: 'integer',
        nullable: true
    }),
    __metadata("design:type", Number)
], Image.prototype, "height", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Image.prototype, "bucketId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Bucket_1.Bucket, bucket => bucket.images, {
        cascadeInsert: false,
        cascadeRemove: false,
        cascadeUpdate: false,
        nullable: false,
        lazy: false
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Bucket_1.Bucket)
], Image.prototype, "bucket", void 0);
Image = __decorate([
    typeorm_1.Entity({
        name: 'image'
    }),
    typeorm_1.Index('name_bucket_id', ['name', 'bucketId'], { unique: true })
], Image);
exports.Image = Image;