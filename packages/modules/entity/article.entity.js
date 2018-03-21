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
const classify_entity_1 = require("./classify.entity");
var EnvConfig;
(function (EnvConfig) {
    EnvConfig[EnvConfig["global"] = 0] = "global";
    EnvConfig[EnvConfig["current"] = 1] = "current";
    EnvConfig[EnvConfig["level1"] = 2] = "level1";
    EnvConfig[EnvConfig["level2"] = 3] = "level2";
    EnvConfig[EnvConfig["level3"] = 4] = "level3";
})(EnvConfig || (EnvConfig = {}));
let ArticleEntity = class ArticleEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ArticleEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 120 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "classify", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ArticleEntity.prototype, "classifyId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "url", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 120 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "source", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "sourceUrl", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ArticleEntity.prototype, "topPlace", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Boolean)
], ArticleEntity.prototype, "hidden", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], ArticleEntity.prototype, "recycling", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], ArticleEntity.prototype, "publishedTime", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "abstract", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 65532 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "display", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], ArticleEntity.prototype, "startTime", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], ArticleEntity.prototype, "endTime", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 300 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "activityAddress", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "organizer", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ArticleEntity.prototype, "peopleNum", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ArticleEntity.prototype, "createAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ArticleEntity.prototype, "updateAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "bucketName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "pictureName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 30 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], ArticleEntity.prototype, "pictureUrl", void 0);
__decorate([
    typeorm_1.OneToMany(type => classify_entity_1.ClassifyEntity, ClassifyEntity => ClassifyEntity.articles),
    __metadata("design:type", Array)
], ArticleEntity.prototype, "classifications", void 0);
ArticleEntity = __decorate([
    typeorm_1.Entity('article_entity_table')
], ArticleEntity);
exports.ArticleEntity = ArticleEntity;
class Article {
}
exports.Article = Article;
