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
const classify_entity_1 = require("../../entity/classify.entity");
const error_interface_1 = require("../errorMessage/error.interface");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("../../entity/article.entity");
const pageClassify_entity_1 = require("../../entity/pageClassify.entity");
const page_entity_1 = require("../../entity/page.entity");
const common_paging_1 = require("../../export/common.paging");
const util_1 = require("util");
const typeorm_3 = require("@nestjs/typeorm");
let ClassifyService = class ClassifyService {
    constructor(repository, artRepository, pageRepository, repositoryPage, pageService) {
        this.repository = repository;
        this.artRepository = artRepository;
        this.pageRepository = pageRepository;
        this.repositoryPage = repositoryPage;
        this.pageService = pageService;
    }
    createClassifyArt(entity, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            let firstClass = yield this.repository.find();
            if (firstClass.length == 0) {
                let newClassify = new classify_entity_1.ClassifyEntity();
                newClassify.groupId = null;
                newClassify.classifyAlias = '无';
                newClassify.title = '无';
                let id = yield this.repository.createQueryBuilder().insert().into(classify_entity_1.ClassifyEntity).values(newClassify).output('id').execute().then(a => { return a; });
                let str = JSON.stringify(id).split(':')[1];
                let numb = str.substring(0, str.lastIndexOf('}'));
                let newId = Number(numb);
                entity.groupId = newId;
                yield this.repository.insert(entity);
            }
            else {
                let newClassify = yield this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: -entity.classifyAlias }).getMany();
                if (newClassify.length > 0)
                    throw new error_interface_1.MessageCodeError('create:classify:aliasRepeat');
                let parentClassify = yield this.repository.findOneById(entity.groupId);
                if (entity.groupId != 0 && parentClassify == null)
                    throw new error_interface_1.MessageCodeError('create:classify:parentIdMissing');
                let first = yield this.repository.findOneById(1);
                if (entity.groupId == 0 && first == null) {
                    entity.groupId = null;
                }
                else if (entity.groupId == 0) {
                    entity.groupId = 1;
                }
                let classify = entity;
                yield this.repository.insert(classify);
            }
            return this.findAllClassifyArt(limit);
        });
    }
    createClassifyPage(entity, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            let firstClass = yield this.pageRepository.find();
            if (firstClass.length == 0) {
                let newClassify = new pageClassify_entity_1.PageClassifyEntity();
                newClassify.groupId = null;
                newClassify.classifyAlias = '无';
                newClassify.title = '无';
                let id = yield this.pageRepository.createQueryBuilder().insert().into(pageClassify_entity_1.PageClassifyEntity).values(newClassify).output('id').execute().then(a => { return a; });
                let str = JSON.stringify(id).split(':')[1];
                let numb = str.substring(0, str.lastIndexOf('}'));
                let newId = Number(numb);
                entity.groupId = newId;
                yield this.pageRepository.insert(entity);
            }
            else {
                let newClassify = yield this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: -entity.classifyAlias }).getMany();
                if (newClassify.length > 0)
                    throw new error_interface_1.MessageCodeError('create:classify:aliasRepeat');
                let parentClassify = yield this.pageRepository.findOneById(entity.groupId);
                if (entity.groupId != 0 && entity.groupId != null && parentClassify == null)
                    throw new error_interface_1.MessageCodeError('create:classify:parentIdMissing');
                let first = yield this.pageRepository.findOneById(1);
                if (entity.groupId == 0 && first == null) {
                    entity.groupId = null;
                }
                else if (entity.groupId == 0) {
                    entity.groupId = 1;
                }
                let classify = entity;
                yield this.pageRepository.insert(classify);
            }
            return this.findAllClassifyPage(limit);
        });
    }
    updateClassifyArt(entity, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let classify = yield this.repository.findOneById(entity.id);
            if (classify == null)
                throw new error_interface_1.MessageCodeError('update:classify:updateById');
            if (entity.classifyAlias != classify.classifyAlias) {
                let newClassify = yield this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: entity.classifyAlias }).getMany();
                if (newClassify.length > 0)
                    throw new error_interface_1.MessageCodeError('create:classify:aliasRepeat');
            }
            if (util_1.isNumber(entity.groupId)) {
                let parentClassify = yield this.repository.findOneById(entity.groupId);
                if (parentClassify == null)
                    throw new error_interface_1.MessageCodeError('create:classify:parentIdMissing');
            }
            let time = new Date();
            entity.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            let finalClassify = entity;
            yield this.repository.updateById(entity.id, finalClassify);
            return this.findAllClassifyArt(id);
        });
    }
    updateClassifyPage(entity, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let classify = yield this.pageRepository.findOneById(entity.id);
            if (classify == null)
                throw new error_interface_1.MessageCodeError('update:classify:updateById');
            if (entity.classifyAlias != classify.classifyAlias) {
                let newClassify = yield this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: entity.classifyAlias }).getMany();
                if (newClassify.length > 0)
                    throw new error_interface_1.MessageCodeError('create:classify:aliasRepeat');
            }
            if (util_1.isNumber(entity.groupId)) {
                let parentClassify = yield this.pageRepository.findOneById(entity.groupId);
                if (parentClassify == null)
                    throw new error_interface_1.MessageCodeError('create:classify:parentIdMissing');
            }
            let time = new Date();
            entity.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            yield this.pageRepository.updateById(entity.id, entity);
            return this.findAllClassifyPage(id);
        });
    }
    findAllClassifyArt(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let idFindOne = yield this.repository.createQueryBuilder().where('"id"= :id', { id: id, }).getOne();
            if (idFindOne) {
                let list = yield this.repository.createQueryBuilder().where('"groupId"= :groupId', { groupId: id, }).orderBy('id', 'ASC').getMany();
                let result = [];
                let resultArray = yield this.Artrecursion(id, list);
                idFindOne.children = resultArray;
                let newPageClassify = idFindOne;
                result.push(newPageClassify);
                return result;
            }
            else {
                let newArt = yield this.repository.find();
                return newArt;
            }
        });
    }
    findAllClassifyPage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let idFindOne = yield this.pageRepository.createQueryBuilder().where('"id"= :id', { id: id, }).getOne();
            if (idFindOne) {
                let list = yield this.pageRepository.createQueryBuilder().where('"groupId"= :id', { id: id, }).orderBy('id', 'ASC').getMany();
                let result = [];
                let resultArray = yield this.Pagerecursion(id, list);
                idFindOne.children = resultArray;
                let newPageClassify = idFindOne;
                result.push(newPageClassify);
                return result;
            }
            else {
                let newPage = yield this.pageRepository.find();
                return newPage;
            }
        });
    }
    Pagerecursion(id, listFirst) {
        return __awaiter(this, void 0, void 0, function* () {
            let children = [];
            for (let t in listFirst) {
                let groupIdFirst = listFirst[t].id;
                let navigationArray = new pageClassify_entity_1.PageClassifyEntity;
                navigationArray = listFirst[t];
                let listSecond = yield this.pageRepository.createQueryBuilder().where('"groupId"= :id', { id: groupIdFirst, }).orderBy('id', 'ASC').getMany();
                if (listSecond.length > 0) {
                    for (let h in listSecond) {
                        let theEnd = yield this.Pagerecursion(listSecond[h].id, listSecond);
                        navigationArray.children = theEnd;
                    }
                }
                else {
                    navigationArray.children = [];
                }
                let navigationFinal = navigationArray;
                children.push(navigationFinal);
            }
            return children;
        });
    }
    Artrecursion(id, listFirst) {
        return __awaiter(this, void 0, void 0, function* () {
            let children = [];
            for (let t in listFirst) {
                let groupIdFirst = listFirst[t].id;
                let navigationArray = new classify_entity_1.ClassifyEntity;
                navigationArray = listFirst[t];
                let listSecond = yield this.repository.createQueryBuilder().where('"groupId"= :id', { id: groupIdFirst, }).orderBy('id', 'ASC').getMany();
                if (listSecond.length > 0) {
                    for (let h in listSecond) {
                        let theEnd = yield this.Artrecursion(listSecond[h].id, listSecond);
                        navigationArray.children = theEnd;
                    }
                }
                else {
                    navigationArray.children = [];
                }
                let navigationFinal = navigationArray;
                children.push(navigationFinal);
            }
            return children;
        });
    }
    deleteClassifyArt(id, result) {
        return __awaiter(this, void 0, void 0, function* () {
            let deleteArray = [];
            for (let t in result) {
                let num = result[t].id;
                if (num == id) {
                    deleteArray.push(id);
                    let array = result[t].children;
                    if (array.length > 0) {
                        for (let h in array) {
                            let numH = array[h].id;
                            deleteArray.push(numH);
                            yield this.repository.deleteById(numH);
                            yield this.deleteClassifyArt(numH, result);
                        }
                    }
                    yield this.repository.deleteById(num);
                }
            }
            if (deleteArray.length == 0) {
                deleteArray.push(id);
            }
            yield this.repository.deleteById(id);
            return deleteArray;
        });
    }
    deleteMethodFirst(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let classify = yield this.repository.findOneById(id);
            if (classify == null)
                throw new error_interface_1.MessageCodeError('update:classify:updateById');
            yield typeorm_2.getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
            const result = yield this.repository.createQueryBuilder('article_classify_table').innerJoinAndSelect('article_classify_table.children', 'children').orderBy('article_classify_table.id').getMany();
            let resultArray = result;
            yield typeorm_2.getManager().query("update public.article_classify_table set \"parentId\"=null");
            let array = yield this.getClassifyId(id).then(a => { return a; });
            array.push(id);
            let newArray = Array.from(new Set(array));
            let artiicles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).getMany();
            if (artiicles.length > 0)
                throw new error_interface_1.MessageCodeError('delete:art:ClassifyIdIncludeArts');
            let res = yield this.deleteClassifyArt(id, result);
            return this.findAllClassifyArt(1);
        });
    }
    deleteMethodSecond(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let classify = yield this.pageRepository.findOneById(id);
            if (classify == null)
                throw new error_interface_1.MessageCodeError('update:classify:updateById');
            yield typeorm_2.getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
            const result = yield this.pageRepository.createQueryBuilder('page_classify_table').innerJoinAndSelect('page_classify_table.children', 'children').orderBy('page_classify_table.id').getMany();
            yield typeorm_2.getManager().query("update public.page_classify_table set \"parentId\"=null");
            let array = yield this.getClassifyIdPage(id).then(a => { return a; });
            array.push(id);
            let newArray = Array.from(new Set(array));
            let artiicles = yield this.repositoryPage.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).getMany();
            if (artiicles.length > 0)
                throw new error_interface_1.MessageCodeError('delete:page:ClassifyIdIncludePages');
            let res = yield this.deleteClassifyPage(id, result);
            return this.findAllClassifyPage(1);
        });
    }
    deleteClassifyPage(id, result) {
        return __awaiter(this, void 0, void 0, function* () {
            let deleteArray = [];
            for (let t in result) {
                let num = result[t].id;
                if (num == id) {
                    deleteArray.push(id);
                    let array = result[t].children;
                    if (array.length > 0) {
                        for (let h in array) {
                            let numH = array[h].id;
                            deleteArray.push(numH);
                            yield this.pageRepository.deleteById(numH);
                            yield this.deleteClassifyPage(numH, result);
                        }
                    }
                    yield this.pageRepository.deleteById(num);
                }
            }
            if (deleteArray.length == 0) {
                deleteArray.push(id);
            }
            yield this.pageRepository.deleteById(id);
            return deleteArray;
        });
    }
    updateArticleClassify(classifyArray, useFor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (useFor == 'art') {
                for (let t in classifyArray) {
                    let article = yield this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId', { classifyId: classifyArray[t] }).getMany();
                    let id = yield this.findTheDefaultByAlias('默认分类', 'art');
                    for (let h in article) {
                        let newArticle = article[h];
                        newArticle.classifyId = id;
                        newArticle.classify = '默认分类';
                        let time = new Date();
                        newArticle.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
                        this.artRepository.updateById(newArticle.id, newArticle);
                    }
                }
            }
            else if (useFor == 'page') {
                for (let t in classifyArray) {
                    let article = yield this.repositoryPage.createQueryBuilder().where('"classifyId"= :classifyId', { classifyId: classifyArray[t] }).getMany();
                    let id = yield this.findTheDefaultByAlias('默认分类', 'page');
                    for (let h in article) {
                        let newArticle = article[h];
                        newArticle.classify = '默认分类';
                        newArticle.classifyId = id;
                        let time = new Date();
                        newArticle.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
                        this.repositoryPage.updateById(newArticle.id, newArticle);
                    }
                }
            }
        });
    }
    findOneByIdArt(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = yield this.repository.findOneById(id);
            return entity;
        });
    }
    findOneByIdPage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = yield this.pageRepository.findOneById(id);
            return entity;
        });
    }
    showNextTitle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let articles = [];
            let arrayNum = [];
            let classifications = yield this.repository.createQueryBuilder()
                .where('"groupId"= :groupId', {
                groupId: id
            }).getMany();
            for (let t in classifications) {
                arrayNum.push(classifications[t].id);
            }
            for (let h in arrayNum) {
                let art = yield this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId', {
                    classifyId: arrayNum[h]
                }).orderBy('id', 'ASC').getMany();
                articles.push(...art);
            }
            return articles;
        });
    }
    showBeforeTitle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let classify = yield this.repository.findOneById(id);
            if (classify == null)
                throw new error_interface_1.MessageCodeError('page:classify:classifyIdMissing');
            let articles = [];
            let currentArticle = yield this.artRepository.createQueryBuilder().
                where('"classifyId"= :classifyId and "topPlace"=\'current\'', { classifyId: classify.groupId }).orderBy('"updateAt"', 'ASC').getMany();
            articles.push(...currentArticle);
            let array = yield this.getClassifyId(classify.groupId).then(a => { return a; });
            array.push(id);
            let newArray = Array.from(new Set(array));
            let finalArray = [];
            for (let t in newArray) {
                if (newArray[t] != classify.groupId) {
                    finalArray.push(newArray[t]);
                }
            }
            let level = yield this.findLevel(classify.groupId);
            if (level == 1) {
                let newArticles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).andWhere('"topPlace"= :topPlace', { topPlace: 'level1' }).orderBy('"updateAt"', 'ASC').getMany();
                articles.push(...newArticles);
            }
            else if (level == 2) {
                let newArticles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).andWhere('"topPlace"= :topPlace', { topPlace: 'level2' }).orderBy('"updateAt"', 'ASC').getMany();
                articles.push(...newArticles);
            }
            else if (level == 3) {
                let newArticles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).andWhere('"topPlace"= :topPlace', { topPlace: 'level3' }).orderBy('"updateAt"', 'ASC').getMany();
                articles.push(...newArticles);
            }
            return articles;
        });
    }
    showCurrentArticles(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let classify = yield this.repository.findOneById(id);
            if (classify == null)
                throw new error_interface_1.MessageCodeError('page:classify:classifyIdMissing');
            let articles = [];
            let current = yield this.artRepository.createQueryBuilder().where('"classifyId"=:id', { id: id }).orderBy('"updateAt"', 'ASC').getMany();
            articles.push(...current);
            return articles;
        });
    }
    getArticelsByClassifyId(id, limit, show, pages, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let str = `%${name}%`;
            let articles = [];
            let entity = yield this.findOneByIdArt(id);
            if (entity == null)
                throw new error_interface_1.MessageCodeError('page:classify:classifyIdMissing');
            let level = yield this.findLevel(entity.id);
            let array = yield this.getClassifyId(id).then(a => { return a; });
            array.push(id);
            let newArray = Array.from(new Set(array));
            if (show == true) {
                let global = [];
                let globalArts = yield this.artRepository.createQueryBuilder().where('"topPlace"= :topPlace', { topPlace: 'global' }).andWhere('"name"like :name and recycling=false', { name: str }).orderBy('"publishedTime"', 'DESC').getMany();
                for (let t in globalArts) {
                    if (globalArts[t].display != null) {
                        let newArray = globalArts[t].display.split(',');
                        let num = newArray.indexOf(id.toString());
                        if (num < 0) {
                            global.push(globalArts[t]);
                        }
                    }
                    else {
                        global.push(globalArts[t]);
                    }
                }
                articles.push(...global);
            }
            if (show == false) {
                let newArticles = yield this.artRepository.createQueryBuilder().where('"classifyId" in(:id)', { id: newArray }).andWhere('"topPlace"=\'current\' or "topPlace"=\'cancel\'').andWhere('"name"like :name', { name: str }).orderBy('"publishedTime"', 'DESC').getMany();
                articles.push(...newArticles);
                level = 5;
            }
            if (show == undefined) {
                level = 4;
            }
            if (level == 1) {
                let newArticles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).andWhere('"topPlace"= :topPlace', { topPlace: 'level1' }).andWhere('"name"like :name and recycling=false', { name: str }).orderBy('"publishedTime"', 'DESC').getMany();
                articles.push(...newArticles);
                let finalArticles = yield this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId  and "topPlace"<>\'global\'', { classifyId: id }).andWhere('"name"like :name and recycling=false', { name: str }).orderBy('"publishedTime"', 'DESC').getMany();
                articles.push(...finalArticles);
            }
            else if (level == 2) {
                let newArticles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).andWhere('"topPlace"= :topPlace', { topPlace: 'level2' }).andWhere('"name"like :name and recycling=false', { name: str }).orderBy('"publishedTime"', 'DESC').getMany();
                articles.push(...newArticles);
                let finalArticles = yield this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId and "topPlace"<>\'level1\' and "topPlace"<>\'global\'', { classifyId: id }).andWhere('"name"like :name and recycling=false', { name: str }).orderBy('"publishedTime"', 'DESC').getMany();
                articles.push(...finalArticles);
            }
            else if (level == 3) {
                let newArticles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).andWhere('"topPlace"= :topPlace', { topPlace: 'level3' }).andWhere('"name"like :name and recycling=false', { name: str }).orderBy('"publishedTime"', 'DESC').getMany();
                articles.push(...newArticles);
                let finalArticles = yield this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId and "topPlace"<>\'level2\' and "topPlace"<>\'global\'', { classifyId: id }).andWhere('"name"like :name and recycling=false', { name: str }).orderBy('"publishedTime"', 'DESC').getMany();
                articles.push(...finalArticles);
            }
            else if (level == 4) {
                let newArticles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id) and recycling=false', { id: newArray }).andWhere('"name"like :name', { name: str }).orderBy('"publishedTime"', 'DESC').getMany();
                articles.push(...newArticles);
            }
            let num = articles.length;
            let returnArt = yield this.Fenji(articles, limit, pages);
            return { articles: returnArt, totalItems: num };
        });
    }
    Fenji(art, limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            let newArt = [];
            if (limit) {
                newArt = art.splice(limit * (pages - 1), limit);
            }
            else {
                newArt = art;
            }
            return newArt;
        });
    }
    getClassifyIdForArt() {
        return __awaiter(this, void 0, void 0, function* () {
            let custom = yield this.repository.createQueryBuilder().where('"classifyAlias"=\'活动\' or "classifyAlias"=\'资讯\'').getMany();
            let customArray = [];
            for (let t in custom) {
                customArray.push(custom[t].id);
                customArray.push(...yield this.getClassifyId(custom[t].id).then(a => { return a; }));
            }
            customArray = Array.from(new Set(customArray));
            return customArray;
        });
    }
    getClassifyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_2.getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
            let entity = yield this.repository.createQueryBuilder().where('"groupId"= :groupId', { groupId: id }).getMany();
            let array = [];
            if (entity.length > 0) {
                const result = yield this.repository.createQueryBuilder('article_classify_table').where('article_classify_table.id= :id', { id: id }).innerJoinAndSelect('article_classify_table.children', 'children').orderBy('article_classify_table.id').getMany();
                let firstArray = result;
                for (let t in firstArray) {
                    array.push(firstArray[t].id);
                    if (firstArray[t].children.length > 0) {
                        for (let h in firstArray[t].children) {
                            array.push(firstArray[t].children[h].id);
                            array.push(...yield this.getClassifyId(firstArray[t].children[h].id));
                        }
                    }
                }
            }
            array.push(id);
            return array;
        });
    }
    getClassifyIdPage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_2.getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
            let array = [];
            let entity = yield this.pageRepository.createQueryBuilder().where('"groupId"= :groupId', { groupId: id }).getMany();
            if (entity.length > 0) {
                const result = yield this.pageRepository.createQueryBuilder('page_classify_table').where('page_classify_table.id= :id', { id: id }).innerJoinAndSelect('page_classify_table.children', 'children').getMany();
                let firstArray = result;
                for (let t in firstArray) {
                    array.push(firstArray[t].id);
                    if (firstArray[t].children.length > 0) {
                        for (let h in firstArray[t].children) {
                            array.push(firstArray[t].children[h].id);
                            array.push(...yield this.getClassifyIdPage(firstArray[t].children[h].id));
                        }
                    }
                }
            }
            array.push(id);
            return array;
        });
    }
    findLevel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = yield this.repository.find();
            let final = yield this.showClassifyLevel(arr, id, 0).then(a => { return a; });
            let num;
            for (let t in final) {
                if (final[t].id == 1) {
                    num = final[t].level;
                }
            }
            return num;
        });
    }
    showClassifyLevel(arr, id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            let array = [];
            for (let t in arr) {
                if (arr[t].id == id) {
                    arr[t].level = level;
                    let newClas = arr[t];
                    array.push(newClas);
                    let arrayCla = yield this.showClassifyLevel(arr, arr[t].groupId, level + 1);
                    array.push(...arrayCla);
                }
            }
            return array;
        });
    }
    interfaceChange(level) {
        let finalLevel;
        if (level == 1) {
            finalLevel = 'level1';
        }
        else if (level == 2) {
            finalLevel = 'level2';
        }
        else if (level == 3) {
            finalLevel = 'level3';
        }
        else if (level == 4) {
            finalLevel == 'current';
        }
        return finalLevel;
    }
    mobileClassifyArt(id, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            let classify = yield this.repository.findOneById(id);
            if (classify == null)
                throw new error_interface_1.MessageCodeError('update:classify:updateById');
            if (groupId != 0) {
                let parent = yield this.repository.findOneById(groupId);
                if (parent == null)
                    throw new error_interface_1.MessageCodeError('update:classify:updateById');
            }
            if (groupId == 0) {
                groupId = 1;
            }
            classify.groupId = groupId;
            let array = yield this.getClassifyId(id).then(a => { return a; });
            array.push(id);
            let newArray = Array.from(new Set(array));
            this.resetTheSetTop(newArray);
            let time = new Date();
            classify.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            let newClassify = classify;
            this.repository.updateById(newClassify.id, newClassify);
            return this.findAllClassifyArt(1);
        });
    }
    resetTheSetTop(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            let articles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: arr }).getMany();
            let time = new Date();
            for (let t in articles) {
                let arr = new article_entity_1.ArticleEntity;
                arr = articles[t];
                arr.topPlace = 'cancel';
                arr.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
                yield this.artRepository.updateById(arr.id, arr);
            }
        });
    }
    mobileClassifyPage(id, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            let classify = yield this.pageRepository.findOneById(id);
            if (classify == null)
                throw new error_interface_1.MessageCodeError('update:classify:updateById');
            if (groupId != 0) {
                let parent = yield this.pageRepository.findOneById(groupId);
                if (parent == null)
                    throw new error_interface_1.MessageCodeError('update:classify:updateById');
            }
            if (groupId == 0) {
                groupId = 1;
            }
            classify.groupId = groupId;
            let time = new Date();
            classify.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            let newClassify = classify;
            this.pageRepository.updateById(newClassify.id, newClassify);
            return this.findAllClassifyPage(1);
        });
    }
    findOnePageClassifyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let final = yield this.pageRepository.findOneById(id);
            return final;
        });
    }
    findTheDefaultByAlias(Alias, useFor) {
        return __awaiter(this, void 0, void 0, function* () {
            let numId = 0;
            if (useFor == 'art') {
                let defaultArt = yield this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: Alias }).getOne();
                if (defaultArt == null) {
                    let classify = new classify_entity_1.ClassifyEntity();
                    classify.groupId = 1;
                    classify.title = '默认分类';
                    classify.classifyAlias = '默认分类';
                    classify.describe = '默认分类';
                    const result = yield this.repository.createQueryBuilder().insert().into(classify_entity_1.ClassifyEntity).values(classify).output('id').execute();
                    let str = JSON.stringify(result);
                    let newstr = str.replace('{', '').replace('}', '').replace('[', '').replace(']', '');
                    let finalStr = newstr.replace('"', '').replace('"', '').split(':');
                    numId = Number(finalStr[1]);
                }
                else {
                    numId = defaultArt.id;
                }
            }
            else if (useFor == 'page') {
                let defaultPage = yield this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: Alias }).getOne();
                if (defaultPage == null) {
                    let classify = new pageClassify_entity_1.PageClassifyEntity();
                    classify.groupId = 1;
                    classify.title = '默认分类';
                    classify.classifyAlias = '默认分类';
                    classify.describe = '默认分类';
                    const result = yield this.pageRepository.createQueryBuilder().insert().into(pageClassify_entity_1.PageClassifyEntity).values(classify).output('id').execute();
                    let str = JSON.stringify(result);
                    let newstr = str.replace('{', '').replace('}', '').replace('[', '').replace(']', '');
                    let finalStr = newstr.replace('"', '').replace('"', '').split(':');
                    numId = Number(finalStr[1]);
                }
                else {
                    numId = defaultPage.id;
                }
            }
            return numId;
        });
    }
    classifyTopPlace(id, display) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = yield this.repository.findOneById(id);
            if (entity == null)
                throw new error_interface_1.MessageCodeError('page:classify:classifyIdMissing');
            let array = yield this.getClassifyId(id).then(a => { return a; });
            array.push(id);
            let newArray = Array.from(new Set(array));
            let num = 0;
            let result = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).andWhere('"topPlace"<> :topPlace', { topPlace: 'global' }).getMany();
            let numArray = [];
            for (let t in display) {
                let array = yield this.getClassifyId(display[t]).then(a => { return a; });
                let newArray = Array.from(new Set(array));
                numArray.push(...newArray);
            }
            numArray.push(...display);
            let finalArray = Array.from(new Set(numArray));
            for (let t in result) {
                let newArt = new article_entity_1.ArticleEntity;
                newArt = result[t];
                newArt.topPlace = 'global';
                newArt.display = finalArray.toString();
                let time = new Date();
                newArt.updateAt = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
                this.artRepository.updateById(newArt.id, newArt);
                num++;
            }
            return num;
        });
    }
    findClassifyById(useFor, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result, MessageCodeError;
            let array = [];
            if (useFor == 'art') {
                let entity = yield this.repository.findOneById(id);
                if (entity == null)
                    MessageCodeError = '当前分类不存在';
                array.push(id);
                array.push(entity.groupId);
                result = yield this.repository.createQueryBuilder().where('"id" in (:id)', { id: array }).orderBy('id', 'ASC').getMany();
            }
            if (useFor == 'page') {
                let entity = yield this.pageRepository.findOneById(id);
                if (entity == null)
                    MessageCodeError = '当前分类不存在';
                array.push(id);
                array.push(entity.groupId);
                result = yield this.pageRepository.createQueryBuilder().where('"id" in (:id)', { id: array }).orderBy('id', 'ASC').getMany();
            }
            if (result != null) {
                MessageCodeError = '查找成功';
            }
            return { classifyEntity: result, MessageCodeError: MessageCodeError };
        });
    }
    TimestampArt(art) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            for (let t in art) {
                if (art[t].id != null) {
                    let entity = new article_entity_1.Article();
                    let time = art[t].createAt;
                    if (art[t].createAt != null) {
                        let createAt = new Date(time.getTime() + time.getTimezoneOffset() * 2 * 30 * 1000);
                        entity.createAt = `${createAt.toLocaleDateString()} ${createAt.toLocaleTimeString()}`;
                    }
                    let newTime = art[t].updateAt;
                    let update = new Date(newTime.getTime() + newTime.getTimezoneOffset() * 2 * 30 * 1000);
                    if (art[t].publishedTime != null) {
                        let publish = new Date(art[t].publishedTime.getTime() + art[t].publishedTime.getTimezoneOffset() * 60 * 1000);
                        entity.publishedTime = `${publish.toLocaleDateString()} ${publish.toLocaleTimeString()}`;
                    }
                    if (art[t].endTime != null) {
                        let endTime = new Date(art[t].endTime.getTime() + art[t].endTime.getTimezoneOffset() * 60 * 1000);
                        entity.endTime = `${endTime.toLocaleDateString()} ${endTime.toLocaleTimeString()}`;
                    }
                    if (art[t].startTime != null) {
                        let startTime = new Date(art[t].startTime.getTime() + art[t].startTime.getTimezoneOffset() * 60 * 1000);
                        entity.startTime = `${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}`;
                    }
                    entity.updateAt = `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`;
                    entity.id = art[t].id;
                    entity.name = art[t].name;
                    entity.classifyId = art[t].classifyId;
                    let timeOne = yield this.repository.createQueryBuilder().where('"id"= :id', { id: art[t].classifyId }).getOne().then(a => { return a.title; });
                    entity.classify = timeOne;
                    entity.abstract = art[t].abstract;
                    entity.content = art[t].content;
                    entity.url = art[t].url;
                    entity.source = art[t].source;
                    entity.sourceUrl = art[t].sourceUrl;
                    entity.topPlace = art[t].topPlace;
                    entity.abstract = art[t].abstract;
                    entity.hidden = art[t].hidden;
                    entity.pictureUrl = art[t].pictureUrl;
                    entity.id = art[t].id;
                    entity.recycling = art[t].recycling;
                    entity.check = false;
                    entity.activityAddress = art[t].activityAddress;
                    entity.peopleNum = art[t].peopleNum;
                    entity.organizer = art[t].organizer;
                    result.push(entity);
                }
            }
            return result;
        });
    }
    TimestampPage(art) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            for (let t in art) {
                let entity = new page_entity_1.Page();
                let time = art[t].createAt;
                let createAt = new Date(time.getTime() + time.getTimezoneOffset() * 2 * 30 * 1000);
                let newTime = art[t].updateAt;
                let update = new Date(newTime.getTime() + newTime.getTimezoneOffset() * 2 * 30 * 1000);
                entity.createAt = `${createAt.toLocaleDateString()} ${createAt.toLocaleTimeString()}`;
                entity.updateAt = `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`;
                entity.id = art[t].id;
                entity.classifyId = art[t].classifyId;
                let timeOne = yield this.pageRepository.createQueryBuilder().where('"id"= :id', { id: art[t].classifyId }).getOne().then(a => { return a.title; });
                entity.classify = timeOne;
                entity.title = art[t].title;
                entity.alias = art[t].alias;
                entity.check = false;
                result.push(entity);
            }
            return result;
        });
    }
    pageServiceArt(totalItems, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = this.pageService.getPager(totalItems, page, limit);
            let res = new common_paging_1.ReturnPage();
            res.totalItems = result.totalItems;
            res.currentPage = result.currentPage;
            res.pageSize = result.pageSize;
            res.totalPages = result.totalPages;
            res.startPage = result.startPage;
            res.endPage = result.endPage;
            res.startIndex = result.startIndex;
            res.endIndex = result.endIndex;
            res.pages = result.pages;
            return res;
        });
    }
    classifyCheck(useFor, id, groupId, alias, deleteNum) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            let update = true;
            if (id > 0) {
                if (useFor == 'art') {
                    let entity = yield this.repository.findOneById(id);
                    if (entity == null)
                        result = "当前文章分类不存在";
                    update = false;
                }
                else {
                    let entity = yield this.pageRepository.findOneById(id);
                    if (entity == null)
                        result = "当前页面分类不存在";
                    update = false;
                }
            }
            if (groupId > 0) {
                if (useFor == 'art') {
                    let entityAll = yield this.repository.find();
                    if (entityAll.length > 0) {
                        let entity = yield this.repository.findOneById(groupId);
                        if (entity == null)
                            result = "当前文章分类父级分类不存在";
                        update = false;
                    }
                }
                else {
                    let entityAll = yield this.pageRepository.find();
                    if (entityAll.length > 0) {
                        let entity = yield this.pageRepository.findOneById(groupId);
                        if (entity == null)
                            result = "当前页面分类父级分类不存在";
                        update = false;
                    }
                }
            }
            if (alias) {
                if (useFor == 'art') {
                    if (id) {
                        let classify = yield this.repository.findOneById(id);
                        if (classify.classifyAlias != alias) {
                            let newClassify = yield this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: alias }).getMany();
                            if (newClassify.length > 0)
                                result = "别名不能重复";
                            update = false;
                        }
                    }
                    else {
                        let newClassify = yield this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: alias }).getMany();
                        if (newClassify.length > 0)
                            result = "别名不能重复";
                        update = false;
                    }
                }
                else {
                    if (id) {
                        let entity = yield this.pageRepository.findOneById(id);
                        if (entity.classifyAlias != alias) {
                            let newClassify = yield this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: alias }).getMany();
                            if (newClassify.length > 0)
                                result = "别名不能重复";
                            update = false;
                        }
                    }
                    else {
                        let newClassify = yield this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias', { classifyAlias: alias }).getMany();
                        if (newClassify.length > 0)
                            result = "别名不能重复";
                        update = false;
                    }
                }
            }
            if (deleteNum > 0) {
                if (useFor == 'art') {
                    let entity = yield this.repository.findOneById(deleteNum);
                    if (entity == null) {
                        result = '当前分类不存在';
                        update = false;
                    }
                    else {
                        let array = yield this.getClassifyId(deleteNum).then(a => { return a; });
                        let newArray = Array.from(new Set(array));
                        let artiicles = yield this.artRepository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).getMany();
                        if (artiicles.length > 0)
                            result = '当前分类下有文章,不能删除';
                        update = false;
                    }
                }
                else {
                    let entity = yield this.pageRepository.findOneById(deleteNum);
                    if (entity == null) {
                        result = '当前分类不存在';
                        update = false;
                    }
                    else {
                        let array = yield this.getClassifyIdPage(deleteNum).then(a => { return a; });
                        let newArray = Array.from(new Set(array));
                        let artiicles = yield this.repositoryPage.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).getMany();
                        if (artiicles.length > 0)
                            result = '当前分类下有页面,不能删除';
                        update = false;
                    }
                }
            }
            if (!result) {
                update = true;
            }
            return { MessageCodeError: result, Continue: update };
        });
    }
};
ClassifyService = __decorate([
    common_1.Component(),
    __param(0, typeorm_3.InjectRepository(classify_entity_1.ClassifyEntity)),
    __param(1, typeorm_3.InjectRepository(article_entity_1.ArticleEntity)),
    __param(2, typeorm_3.InjectRepository(pageClassify_entity_1.PageClassifyEntity)),
    __param(3, typeorm_3.InjectRepository(page_entity_1.PageEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        common_paging_1.PagerService])
], ClassifyService);
exports.ClassifyService = ClassifyService;
