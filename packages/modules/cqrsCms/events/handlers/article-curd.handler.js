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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const article_curd_events_1 = require("../impl/article-curd.events");
const cqrs_1 = require("@nestjs/cqrs");
const article_service_1 = require("../../service/article.service");
const clc = require('cli-color');
let ArticleCurdEvent = class ArticleCurdEvent {
    constructor(articleService) {
        this.articleService = articleService;
    }
    handle(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(clc.yellowBright('Async create curd  article...'));
            if (event.article.createArticle) {
                yield this.articleService.createArticle(event.article.createArticle.article);
            }
            if (event.article.updateArticle) {
                yield this.articleService.updateArticle(event.article.updateArticle.article);
            }
            if (event.article.deleteById) {
                let array = event.article.deleteById;
                yield this.articleService.deleteArticles(array);
            }
            if (event.article.recycleDelete) {
                yield this.articleService.recycleDelete(event.article.recycleDelete);
            }
            if (event.article.reductionArticle) {
                yield this.articleService.reductionArticle(event.article.reductionArticle);
            }
            if (event.article.pictureUpload) {
                yield this.articleService.upLoadPicture(event.article.pictureUpload.url, event.article.pictureUpload.bucketName, event.article.pictureUpload.rawName, event.article.pictureUpload.base64);
            }
        });
    }
};
ArticleCurdEvent = __decorate([
    cqrs_1.EventsHandler(article_curd_events_1.ArticleCurdEvents),
    __metadata("design:paramtypes", [article_service_1.ArticleService])
], ArticleCurdEvent);
exports.ArticleCurdEvent = ArticleCurdEvent;
