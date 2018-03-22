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
const cqrs_1 = require("@nestjs/cqrs");
const pageRepository_1 = require("../../repository/pageRepository");
const article_param_command_1 = require("../impl/article-param.command");
const article_service_1 = require("../../service/article.service");
const classify_service_1 = require("../../service/classify.service");
const clc = require('cli-color');
let ArticleCurdHandler = class ArticleCurdHandler {
    constructor(repositoty, publisher, articleService, classifyService) {
        this.repositoty = repositoty;
        this.publisher = publisher;
        this.articleService = articleService;
        this.classifyService = classifyService;
    }
    execute(command, resolver) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(clc.greenBright('handlerCommand article_curd Command...'));
            let id = '0';
            const page = this.publisher.mergeObjectContext(yield this.repositoty.find(id));
            let result;
            if (!command.article.getAllArticles) {
                let value, MessageCodeError;
                if (command.article.createArticle) {
                    let result = yield this.articleService.CurdArticleCheck(command.article.createArticle.article.classifyId, 0).then(a => { return a; });
                    value = result.Continue;
                    MessageCodeError = result.MessageCodeError;
                }
                if (command.article.updateArticle) {
                    const result = yield this.articleService.CurdArticleCheck(command.article.updateArticle.article.classifyId, command.article.updateArticle.article.id);
                    value = result.Continue;
                    MessageCodeError = result.MessageCodeError;
                }
                if (command.article.pictureUpload) {
                    const result = yield this.articleService.upLoadPicture(command.article.pictureUpload.url, command.article.pictureUpload.bucketName, command.article.pictureUpload.rawName, command.article.pictureUpload.base64, command.article.pictureUpload.id);
                    value = false;
                    resolver(result);
                }
                if (value == undefined)
                    value = true;
                if (value)
                    page.createArticle(command.article);
                resolver({ MessageCodeError: MessageCodeError, Continue: value });
            }
            if (command.article.getAllArticles && command.article.getArticles.getArticleAll) {
                result = yield this.articleService.getArticleAll(command.article.limitNum, command.article.getArticles.hidden, command.article.pages);
            }
            if (command.article.getAllArticles && command.article.getArticles.getArticleById) {
                result = yield this.articleService.getArticleById(command.article.getArticles.getArticleById);
            }
            if (command.article.getAllArticles && command.article.getArticles.recycleFind) {
                result = yield this.articleService.recycleFind(command.article.limitNum, command.article.pages).then(a => { return a; });
            }
            if (command.article.getAllArticles && command.article.getArticles.reductionGetByClassifyId) {
                result = yield this.articleService.reductionClassity(command.article.getArticles.reductionGetByClassifyId, command.article.limitNum, command.article.pages);
            }
            if (command.article.getAllArticles && command.article.getArticles.getArticleByClassifyId) {
                result = yield this.classifyService.getArticelsByClassifyId(command.article.getArticles.getArticleByClassifyId.classifyId, command.article.limitNum, command.article.getArticles.getArticleByClassifyId.top, command.article.pages, command.article.getArticles.getArticleByClassifyId.name);
            }
            if (command.article.getAllArticles && command.article.getArticles.findTopPlace) {
                result = yield this.articleService.findTopPlace(command.article.limitNum, command.article.pages);
            }
            if (command.article.getAllArticles && command.article.getArticles.showNext) {
                result = yield this.classifyService.showNextTitle(command.article.getArticles.showNext);
            }
            if (command.article.getAllArticles && command.article.getArticles.superiorArticle) {
                result = yield this.classifyService.showBeforeTitle(command.article.getArticles.superiorArticle);
            }
            if (command.article.getAllArticles && command.article.getArticles.getCurrentClassifyArticles) {
                result = yield this.classifyService.showCurrentArticles(command.article.getArticles.getCurrentClassifyArticles);
            }
            if (command.article.getArticles && command.article.getArticles.keywordSearch) {
                result = yield this.articleService.searchArticles(command.article.getArticles.keywordSearch, command.article.limitNum, command.article.pages);
            }
            page.commit();
            resolver(result);
        });
    }
};
ArticleCurdHandler = __decorate([
    cqrs_1.CommandHandler(article_param_command_1.ArticleParamCommand),
    __metadata("design:paramtypes", [pageRepository_1.PageRepository,
        cqrs_1.EventPublisher,
        article_service_1.ArticleService,
        classify_service_1.ClassifyService])
], ArticleCurdHandler);
exports.ArticleCurdHandler = ArticleCurdHandler;
