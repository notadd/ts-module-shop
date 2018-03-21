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
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var EnvConfig;
(function (EnvConfig) {
    EnvConfig[EnvConfig["global"] = 0] = "global";
    EnvConfig[EnvConfig["current"] = 1] = "current";
    EnvConfig[EnvConfig["level1"] = 2] = "level1";
    EnvConfig[EnvConfig["level2"] = 3] = "level2";
    EnvConfig[EnvConfig["level3"] = 4] = "level3";
})(EnvConfig = exports.EnvConfig || (exports.EnvConfig = {}));
class GetLimit {
}
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], GetLimit.prototype, "limitNumber", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Boolean }),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Object)
], GetLimit.prototype, "hidden", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], GetLimit.prototype, "pages", void 0);
exports.GetLimit = GetLimit;
class GetClassifyLimit {
}
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], GetClassifyLimit.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], GetClassifyLimit.prototype, "limitNumber", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], GetClassifyLimit.prototype, "pages", void 0);
exports.GetClassifyLimit = GetClassifyLimit;
class GetLimitNum {
}
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], GetLimitNum.prototype, "limitNumber", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], GetLimitNum.prototype, "pages", void 0);
exports.GetLimitNum = GetLimitNum;
class KeyWords {
}
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], KeyWords.prototype, "limitNumber", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], KeyWords.prototype, "keyWords", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], KeyWords.prototype, "pages", void 0);
exports.KeyWords = KeyWords;
class DeleteArticleId {
}
__decorate([
    swagger_1.ApiModelProperty({ type: Array }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], DeleteArticleId.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], DeleteArticleId.prototype, "limitNumber", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], DeleteArticleId.prototype, "pages", void 0);
exports.DeleteArticleId = DeleteArticleId;
class CreateArticle {
}
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateArticle.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateArticle.prototype, "content", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], CreateArticle.prototype, "classifyId", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateArticle.prototype, "classifyName", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateArticle.prototype, "abstractArticle", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], CreateArticle.prototype, "topPlace", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Boolean, required: true }),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Object)
], CreateArticle.prototype, "hidden", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateArticle.prototype, "publishedTime", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateArticle.prototype, "source", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateArticle.prototype, "sourceUrl", void 0);
exports.CreateArticle = CreateArticle;
class UpdateArticle {
}
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "classifyId", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "classifyName", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "content", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "abstractArticle", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], UpdateArticle.prototype, "topPlace", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Boolean, required: true }),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "hidden", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "publishedTime", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "source", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateArticle.prototype, "sourceUrl", void 0);
exports.UpdateArticle = UpdateArticle;
class GetClassify {
}
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], GetClassify.prototype, "usedFor", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], GetClassify.prototype, "id", void 0);
exports.GetClassify = GetClassify;
class CreateClassify {
}
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateClassify.prototype, "usedFor", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateClassify.prototype, "classifyName", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateClassify.prototype, "classifyAlias", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateClassify.prototype, "chainUrl", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateClassify.prototype, "describe", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreateClassify.prototype, "color", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], CreateClassify.prototype, "parentId", void 0);
exports.CreateClassify = CreateClassify;
class UpdateClassify {
}
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateClassify.prototype, "usedFor", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], UpdateClassify.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateClassify.prototype, "classifyName", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateClassify.prototype, "classifyAlias", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateClassify.prototype, "chainUrl", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateClassify.prototype, "describe", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdateClassify.prototype, "color", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], UpdateClassify.prototype, "parentId", void 0);
exports.UpdateClassify = UpdateClassify;
class DeleteDto {
}
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], DeleteDto.prototype, "usedFor", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], DeleteDto.prototype, "id", void 0);
exports.DeleteDto = DeleteDto;
class showNextDto {
}
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], showNextDto.prototype, "id", void 0);
exports.showNextDto = showNextDto;
class PageSerach {
}
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], PageSerach.prototype, "keyWords", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], PageSerach.prototype, "limitNum", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], PageSerach.prototype, "pages", void 0);
exports.PageSerach = PageSerach;
class MobileClassify {
}
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], MobileClassify.prototype, "usedFor", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], MobileClassify.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], MobileClassify.prototype, "parentId", void 0);
exports.MobileClassify = MobileClassify;
class CreatePage {
}
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreatePage.prototype, "title", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreatePage.prototype, "alias", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Array }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], CreatePage.prototype, "content", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Boolean, required: true }),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Object)
], CreatePage.prototype, "open", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], CreatePage.prototype, "classify", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], CreatePage.prototype, "limitNum", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], CreatePage.prototype, "pages", void 0);
exports.CreatePage = CreatePage;
class ContentMap {
}
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], ContentMap.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], ContentMap.prototype, "content", void 0);
exports.ContentMap = ContentMap;
class UpdatePage {
}
__decorate([
    swagger_1.ApiModelProperty({ type: Number, required: true }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], UpdatePage.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdatePage.prototype, "title", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: String, required: true }),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], UpdatePage.prototype, "alias", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: Number }),
    class_validator_1.IsInt(),
    __metadata("design:type", Object)
], UpdatePage.prototype, "classify", void 0);
__decorate([
    swagger_1.ApiModelProperty({ type: ContentMap }),
    __metadata("design:type", Array)
], UpdatePage.prototype, "contents", void 0);
exports.UpdatePage = UpdatePage;
