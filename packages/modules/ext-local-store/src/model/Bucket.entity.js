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
const ImageConfig_entity_1 = require("./ImageConfig.entity");
const AudioConfig_entity_1 = require("./AudioConfig.entity");
const VideoConfig_entity_1 = require("./VideoConfig.entity");
const Document_entity_1 = require("./Document.entity");
const Image_entity_1 = require("./Image.entity");
const Video_entity_1 = require("./Video.entity");
const Audio_entity_1 = require("./Audio.entity");
const File_entity_1 = require("./File.entity");
let Bucket = class Bucket {
};
__decorate([
    typeorm_1.PrimaryColumn({
        name: 'id',
        type: 'integer'
    }),
    __metadata("design:type", Number)
], Bucket.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'public_or_private',
        type: 'varchar',
        length: 20,
        nullable: false,
        unique: true
    }),
    __metadata("design:type", String)
], Bucket.prototype, "public_or_private", void 0);
__decorate([
    typeorm_1.Column({
        name: 'name',
        type: 'varchar',
        length: 20,
        nullable: false
    }),
    __metadata("design:type", String)
], Bucket.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: 'token_secret_key',
        type: 'varchar',
        length: 250,
        nullable: true
    }),
    __metadata("design:type", String)
], Bucket.prototype, "token_secret_key", void 0);
__decorate([
    typeorm_1.Column({
        name: 'token_expire',
        type: 'integer',
        nullable: true
    }),
    __metadata("design:type", Number)
], Bucket.prototype, "token_expire", void 0);
__decorate([
    typeorm_1.OneToOne(type => ImageConfig_entity_1.ImageConfig, imageConfig => imageConfig.bucket, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true,
        lazy: false
    }),
    __metadata("design:type", ImageConfig_entity_1.ImageConfig)
], Bucket.prototype, "image_config", void 0);
__decorate([
    typeorm_1.OneToOne(type => AudioConfig_entity_1.AudioConfig, audioConfig => audioConfig.bucket, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true,
        lazy: false
    }),
    __metadata("design:type", AudioConfig_entity_1.AudioConfig)
], Bucket.prototype, "audio_config", void 0);
__decorate([
    typeorm_1.OneToOne(type => VideoConfig_entity_1.VideoConfig, videoConfig => videoConfig.bucket, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true,
        lazy: false
    }),
    __metadata("design:type", VideoConfig_entity_1.VideoConfig)
], Bucket.prototype, "video_config", void 0);
__decorate([
    typeorm_1.OneToMany(type => File_entity_1.File, file => file.bucket, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    }),
    __metadata("design:type", Promise)
], Bucket.prototype, "files", void 0);
__decorate([
    typeorm_1.OneToMany(type => Image_entity_1.Image, image => image.bucket, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    }),
    __metadata("design:type", Promise)
], Bucket.prototype, "images", void 0);
__decorate([
    typeorm_1.OneToMany(type => Audio_entity_1.Audio, audio => audio.bucket, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    }),
    __metadata("design:type", Promise)
], Bucket.prototype, "audios", void 0);
__decorate([
    typeorm_1.OneToMany(type => Video_entity_1.Video, video => video.bucket, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    }),
    __metadata("design:type", Promise)
], Bucket.prototype, "videos", void 0);
__decorate([
    typeorm_1.OneToMany(type => Document_entity_1.Document, document => document.bucket, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    }),
    __metadata("design:type", Promise)
], Bucket.prototype, "documents", void 0);
Bucket = __decorate([
    typeorm_1.Entity({
        name: 'bucket'
    })
], Bucket);
exports.Bucket = Bucket;
