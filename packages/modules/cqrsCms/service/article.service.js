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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const article_entity_1 = require("../../entity/article.entity");
const error_interface_1 = require("../errorMessage/error.interface");
const typeorm_2 = require("@nestjs/typeorm");
const classify_service_1 = require("./classify.service");
const error_interface_2 = require("../common/error.interface");
const clc = require('cli-color');
let ArticleService = class ArticleService {
    constructor(respository, classifyService, storeService) {
        this.respository = respository;
        this.classifyService = classifyService;
        this.storeService = storeService;
    }
    getArticleAll(limit, hidden, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            let title = 0;
            let resultAll = [];
            if (hidden == true) {
                let newArray = [];
                let newresult = yield this.respository.createQueryBuilder().where('"recycling"<> :recycling and hidden=true', { recycling: false }).orderBy('"publishedTime"', 'DESC').skip(limit * (pages - 1)).take(limit).getMany();
                for (let t in newresult) {
                    if (newresult[t].hidden) {
                        newArray.push(newresult[t]);
                    }
                }
                title = yield this.respository.createQueryBuilder().where('"recycling"<> :recycling and hidden=true', { recycling: false }).getCount();
                resultAll.push(...newArray);
            }
            if (hidden == false) {
                let newresult = yield this.respository.createQueryBuilder().where('"recycling"<> :recycling  and hidden=false', { recycling: false }).orderBy('"publishedTime"', 'DESC').skip(limit * (pages - 1)).take(limit).getMany();
                title = yield this.respository.createQueryBuilder().where('"recycling"<> :recycling and hidden=false', { recycling: false }).getCount();
                resultAll.push(...newresult);
            }
            if (hidden == undefined) {
                let newresult = yield this.respository.createQueryBuilder().where('recycling=false or recycling is null').orderBy('"publishedTime"', 'DESC').skip(limit * (pages - 1)).take(limit).getMany();
                title = yield this.respository.createQueryBuilder().where('recycling=false or recycling is null').getCount();
                resultAll.push(...newresult);
            }
            return { articles: resultAll, totalItems: title };
        });
    }
    searchArticles(name, limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            let strArt = `%${name}%`;
            let array = yield this.classifyService.getClassifyIdForArt();
            let articles = yield this.respository.createQueryBuilder()
                .where('"classifyId" in (:id)', { id: array })
                .andWhere('"name"like :name and "recycling" =\'false\' or recycling isnull ', { name: strArt })
                .orderBy('"publishedTime"', 'DESC')
                .skip(limit * (pages - 1))
                .take(limit)
                .getMany();
            let num = yield this.respository.createQueryBuilder().where('"classifyId" in (:id)', { id: array })
                .andWhere('"name"like :name and "recycling" =\'false\' or recycling isnull ', { name: strArt })
                .getCount();
            return { articles: articles, totalItems: num };
        });
    }
    deleteArticles(array) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            for (let t in array) {
                let article = yield this.respository.findOneById(array[t]);
                if (article == null)
                    throw new error_interface_1.MessageCodeError('delete:recycling:idMissing');
                article.recycling = true;
                let time = new Date();
                article.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
                let newArticle = article;
                this.respository.updateById(newArticle.id, newArticle);
                count++;
            }
            return count;
        });
    }
    createArticle(article) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = yield this.classifyService.findOneByIdArt(article.classifyId);
            if (article.classifyId != null && article.classifyId != 0 && entity == null)
                throw new error_interface_1.MessageCodeError('page:classify:classifyIdMissing');
            let num = yield this.classifyService.findLevel(article.classifyId);
            let level = this.classifyService.interfaceChange(num);
            if (article.topPlace == null) {
                article.topPlace = 'cancel';
            }
            let levelGive = article.topPlace.toString();
            if (level == 'level1' && levelGive == 'level2' || levelGive == 'level3')
                throw new error_interface_1.MessageCodeError('create:level:lessThanLevel');
            if (level == 'level2' && levelGive == 'level3')
                throw new error_interface_1.MessageCodeError('create:level:lessThanLevel');
            let time = new Date();
            if (article.publishedTime) {
                time = article.publishedTime;
                article.publishedTime = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            }
            if (article.publishedTime == null) {
                article.publishedTime = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            }
            if (article.startTime) {
                time = article.startTime;
                article.startTime = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            }
            if (article.endTime) {
                time = article.endTime;
                article.endTime = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            }
            article.recycling = false;
            yield this.respository.createQueryBuilder().insert().into(article_entity_1.ArticleEntity).values(article).output('id').execute().then(a => { return a; });
        });
    }
    updateArticle(article) {
        return __awaiter(this, void 0, void 0, function* () {
            let art = yield this.respository.findOneById(article.id);
            if (art == null)
                throw new error_interface_1.MessageCodeError('delete:recycling:idMissing');
            let entity = yield this.classifyService.findOneByIdArt(article.classifyId);
            if (article.classifyId != null && article.classifyId != 0 && entity == null)
                throw new error_interface_1.MessageCodeError('page:classify:classifyIdMissing');
            let num = yield this.classifyService.findLevel(article.classifyId);
            let level = this.classifyService.interfaceChange(num);
            let levelGive = article.topPlace;
            if (level == 'level1' && levelGive == 'level2' || levelGive == 'level3')
                throw new error_interface_1.MessageCodeError('create:level:lessThanLevel');
            if (level == 'level2' && levelGive == 'level3')
                throw new error_interface_1.MessageCodeError('create:level:lessThanLevel');
            let time = new Date();
            article.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            if (article.startTime) {
                time = article.startTime;
                article.startTime = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            }
            if (article.endTime) {
                time = article.endTime;
                article.endTime = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            }
            if (article.publishedTime) {
                time = article.publishedTime;
                article.publishedTime = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            }
            let newArt = article;
            yield this.respository.updateById(newArt.id, newArt);
        });
    }
    recycleFind(limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.respository.createQueryBuilder().where('"recycling"= :recycling', { recycling: true }).orderBy('"publishedTime"', 'ASC').skip(limit * (pages - 1)).take(limit).getMany();
            let title = yield this.respository.createQueryBuilder().where('"recycling"= :recycling', { recycling: true }).getCount();
            return { articles: result, totalItems: title };
        });
    }
    recycleDelete(array) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.respository.createQueryBuilder().delete()
                    .from(article_entity_1.ArticleEntity).whereInIds(array)
                    .output('id').execute()
                    .then(a => { return a; });
            }
            catch (err) {
                throw new common_1.HttpException('删除错误' + err.toString(), 401);
            }
            return result;
        });
    }
    reductionArticle(array) {
        return __awaiter(this, void 0, void 0, function* () {
            let num = 0;
            for (let t in array) {
                let article = yield this.respository.findOneById(array[t]);
                if (article == null)
                    throw new error_interface_1.MessageCodeError('delete:recycling:idMissing');
                article.recycling = false;
                let time = new Date();
                article.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
                let newArticle = article;
                this.respository.updateById(newArticle.id, newArticle);
                num++;
            }
            return num;
        });
    }
    findTopPlace(limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.respository.createQueryBuilder().where('"topPlace"= :topPlace', { topPlace: 'global' }).orderBy('"updateAt"', 'DESC').skip(limit * (pages - 1)).take(limit).getMany();
            let title = yield this.respository.createQueryBuilder().where('"topPlace"= :topPlace', { topPlace: 'global' }).getCount();
            return { articles: result, totalItems: title };
        });
    }
    reductionClassity(id, limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = yield this.classifyService.findOneByIdArt(id);
            if (entity == null)
                throw new error_interface_1.MessageCodeError('page:classify:classifyIdMissing');
            let array = yield this.classifyService.getClassifyId(id).then(a => { return a; });
            array.push(id);
            let newArray = Array.from(new Set(array));
            let result = yield this.respository.createQueryBuilder().where('"classifyId" in (:classifyId)  and recycling=true', { classifyId: newArray }).orderBy('id', 'ASC').skip(limit * (pages - 1)).take(limit).getMany();
            let title = yield this.respository.createQueryBuilder().where('"classifyId" in (:classifyId)  and recycling=true', { classifyId: newArray }).getCount();
            return { articles: result, totalItems: title };
        });
    }
    getArticleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let Array = [];
            let article = yield this.respository.findOneById(id);
            if (article == null)
                throw new error_interface_1.MessageCodeError('delete:recycling:idMissing');
            let newArticle = article;
            Array.push(newArticle);
            return Array;
        });
    }
    getLevelByClassifyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = yield this.classifyService.findOneByIdArt(id);
            if (entity == null)
                throw new error_interface_1.MessageCodeError('delete:recycling:idMissing');
            let num = yield this.classifyService.findLevel(entity.id).then(a => { return a; });
            let level = this.classifyService.interfaceChange(num);
            let topPlace = '';
            if (level == 'level1') {
                topPlace = `global,current`;
            }
            else if (level == 'level2') {
                topPlace = `global,level1,current`;
            }
            else if (level == 'level3') {
                topPlace = `global,level1,current,level2`;
            }
            else {
                topPlace = `global,level1,level2,level3,current`;
            }
            return topPlace;
        });
    }
    CurdArticleCheck(classifyId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            let update = true;
            if (id > 0) {
                let aliasEntity = yield this.respository.findOneById(id);
                if (aliasEntity == null)
                    result = "当前文章不存在";
                update = false;
            }
            if (classifyId > 0) {
                let entity = yield this.classifyService.findOneByIdArt(classifyId);
                if (entity == null)
                    result = "对应分类不存在";
                update = false;
            }
            if (!result) {
                update = true;
            }
            return { MessageCodeError: result, Continue: update };
        });
    }
    upLoadPicture(req, bucketName, rawName, base64, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (id > 0) {
                    let entity = yield this.respository.findOneById(id);
                    if (entity && entity.bucketName != null) {
                        let entitys = yield this.respository.find({ pictureUrl: entity.pictureUrl });
                        if (entitys.length == 1) {
                            yield this.storeService.delete(entity.bucketName, entity.pictureName, entity.type);
                        }
                    }
                }
                let imagePreProcessInfo = new error_interface_2.ImagePreProcessInfo();
                imagePreProcessInfo.watermark = false;
                let result = yield this.storeService.upload(bucketName, rawName, base64, imagePreProcessInfo).then(a => { return a; });
                let map = this.objToStrMap(result);
                let bucket = map.get('bucketName');
                let name = map.get('name');
                let type = map.get('type');
                let url = yield this.storeService.getUrl(req.get('obj'), bucket, name, type, imagePreProcessInfo).then(a => { return a; });
                return { pictureUrl: url, bucketName: bucket, pictureName: name, type: type, MessageCodeError: "上传成功" };
            }
            catch (err) {
                return { MessageCodeError: "上传失败" };
            }
        });
    }
    objToStrMap(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }
};
ArticleService = __decorate([
    common_1.Component(),
    __param(0, typeorm_2.InjectRepository(article_entity_1.ArticleEntity)),
    __param(2, common_1.Inject('StoreComponentToken')),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        classify_service_1.ClassifyService, Object])
], ArticleService);
exports.ArticleService = ArticleService;
