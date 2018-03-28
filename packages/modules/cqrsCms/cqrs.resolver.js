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
const graphql_1 = require("@nestjs/graphql");
const classify_service_1 = require("./service/classify.service");
const page_entity_1 = require("../entity/page.entity");
const page_content_entity_1 = require("../entity/page.content.entity");
const error_interface_1 = require("./errorMessage/error.interface");
const cqrs_service_1 = require("./cqrs.service");
const create_page_vm_1 = require("./models/view/create-page.vm");
const get_page_vm_1 = require("./models/view/get-page.vm");
const classify_curd_vm_1 = require("./models/view/classify-curd.vm");
const article_curd_vm_1 = require("./models/view/article-curd.vm");
const common_paging_1 = require("../export/common.paging");
const clc = require('cli-color');
let CqrsResolver = class CqrsResolver {
    constructor(classifyService, sitemapService, pagerService) {
        this.classifyService = classifyService;
        this.sitemapService = sitemapService;
        this.pagerService = pagerService;
    }
    createFile(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            let createxml = map.get('buildxml');
            const result = this.sitemapService.createXml(createxml);
            return result;
        });
    }
    updateFile(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            let createxml = map.get('updateFile');
            const result = this.sitemapService.updateXml();
            return createxml;
        });
    }
    getArticlesLimit(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            let resultPage;
            let result;
            let getArticle = map.get('getArticleAll');
            let articleVM = new article_curd_vm_1.ArticleCurdVm();
            if (getArticle != null || getArticle != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(getArticle);
                articleVM.getArticles = { getArticleAll: true, hidden: amap.get('hidden') };
                articleVM.limitNum = amap.get('limitNum');
                articleVM.pages = amap.get('pages');
            }
            let recycleFind = map.get('recycleFind');
            if (recycleFind != null || recycleFind != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(recycleFind);
                articleVM.getArticles = { recycleFind: true };
                articleVM.limitNum = amap.get('limitNum');
                articleVM.pages = amap.get('pages');
            }
            let reductionGetByClassifyId = map.get('reductionGetByClassifyId');
            if (reductionGetByClassifyId != null || reductionGetByClassifyId != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(reductionGetByClassifyId);
                articleVM.getArticles = { reductionGetByClassifyId: amap.get('id') };
                articleVM.limitNum = amap.get('limitNum');
                articleVM.pages = amap.get('pages');
            }
            let findTopPlace = map.get('findTopPlace');
            if (findTopPlace != null || findTopPlace != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(findTopPlace);
                articleVM.getArticles = { findTopPlace: true };
                articleVM.limitNum = amap.get('limitNum');
                articleVM.pages = amap.get('pages');
            }
            let serachArticle = map.get('serachArticle');
            if (serachArticle != null || serachArticle != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(serachArticle);
                let keyWords = amap.get('keyWords');
                let limitNum = amap.get('limitNum');
                let pages = amap.get('pages');
                let groupId = amap.get('classifyId');
                let findTop = amap.get('topPlace');
                if (!keyWords)
                    keyWords = "";
                articleVM.getArticles = { getArticleByClassifyId: { classifyId: groupId, top: findTop, name: keyWords } };
                articleVM.limitNum = limitNum;
                articleVM.pages = pages;
            }
            let keywordSearch = map.get('keywordSearch');
            if (keywordSearch != null || keywordSearch != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(keywordSearch);
                let keyWords = amap.get('keyWords');
                articleVM.getArticles = { keywordSearch: keyWords };
                articleVM.limitNum = amap.get('limitNum');
                articleVM.pages = amap.get('pages');
            }
            articleVM.getAllArticles = true;
            let resultArt = yield this.sitemapService.articleCurd(articleVM);
            const paging = this.pagerService.getPager(resultArt.totalItems, articleVM.pages, articleVM.limitNum);
            result = yield this.classifyService.TimestampArt(resultArt.articles);
            return { pagination: paging, articles: result };
        });
    }
    getArticlesNoLimit(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            let articleVM = new article_curd_vm_1.ArticleCurdVm();
            let showNext = map.get('showNext');
            let result;
            if (showNext != null || showNext != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(showNext);
                articleVM.getArticles = { showNext: amap.get('id') };
            }
            let getArticleById = map.get('getArticleById');
            if (getArticleById != null || getArticleById != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(getArticleById);
                articleVM.getArticles = { getArticleById: amap.get('id') };
            }
            let superiorArticle = map.get('superiorArticle');
            if (superiorArticle != null || superiorArticle != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(superiorArticle);
                articleVM.getArticles = { superiorArticle: amap.get('id') };
            }
            let getCurrentClassifyArticles = map.get('getCurrentClassifyArticles');
            if (getCurrentClassifyArticles != null || getCurrentClassifyArticles != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(getCurrentClassifyArticles);
                articleVM.getArticles = { getCurrentClassifyArticles: amap.get('id') };
            }
            articleVM.getAllArticles = true;
            let entity = yield this.sitemapService.articleCurd(articleVM);
            result = yield this.classifyService.TimestampArt(entity);
            return result;
        });
    }
    getClassifys(obj, arg) {
        const str = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let result;
        let classifyVM = new classify_curd_vm_1.ClassifyCurdVm();
        let getAllClassify = map.get('getAllClassify');
        if (getAllClassify != null || getAllClassify != undefined) {
            let amap = new Map();
            amap = this.objToStrMap(getAllClassify);
            let useFor = amap.get('useFor');
            let id = amap.get('id');
            if (id == null || id == 0) {
                id = 1;
            }
            classifyVM.useFor = useFor;
            classifyVM.getAllClassify = true;
        }
        result = this.sitemapService.getClassify(classifyVM);
        return result;
    }
    getClassifyById(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            let result;
            let classifyVM = new classify_curd_vm_1.ClassifyCurdVm();
            let getClassifyById = map.get('getClassifyById');
            if (getClassifyById != null || getClassifyById != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(getClassifyById);
                let useFor = amap.get('useFor');
                let id = amap.get('id');
                if (id == null || id == 0) {
                    id = 1;
                }
                classifyVM.getClassifyById = { useFor: useFor, id: id };
            }
            result = yield this.sitemapService.getClassify(classifyVM);
            return result;
        });
    }
    getPagesLimit(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            let PageReturn;
            let pagination;
            let getAllPage = map.get('getAllPage');
            let pageParam = new get_page_vm_1.GetPageVm();
            if (getAllPage != null || getAllPage != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(getAllPage);
                pageParam.getAll = true;
                pageParam.limit = amap.get('limitNum');
                pageParam.pages = amap.get('pages');
            }
            let serachPages = map.get('serachPages');
            if (serachPages != null || serachPages != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(serachPages);
                pageParam.keywords = amap.get('keywords');
                pageParam.limit = amap.get('limitNum');
                pageParam.pages = amap.get('pages');
            }
            let getPagesByClassifyId = map.get('getPagesByClassifyId');
            if (getPagesByClassifyId != null || getPagesByClassifyId != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(getPagesByClassifyId);
                pageParam.classifyId = amap.get('id');
                pageParam.limit = amap.get('limitNum');
                pageParam.pages = amap.get('pages');
            }
            let resultPage = yield this.sitemapService.getPages(pageParam).then(a => { return a; });
            PageReturn = yield this.classifyService.TimestampPage(resultPage.pages);
            const paging = this.pagerService.getPager(resultPage.totalItems, pageParam.pages, pageParam.limit);
            return { pagination: paging, pages: PageReturn };
        });
    }
    getPageById(obj, arg) {
        const str = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let findPageById = map.get('findPageById');
        if (findPageById != null || findPageById != undefined) {
            let amap = new Map();
            amap = this.objToStrMap(findPageById);
            let pageParam = new get_page_vm_1.GetPageVm();
            pageParam.id = amap.get('id');
            const result = this.sitemapService.getPages(pageParam);
            return result;
        }
    }
    ArticleCU(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            let createArt = map.get('createArt');
            let articleVM = new article_curd_vm_1.ArticleCurdVm();
            articleVM.limitNum = map.get('limitNum');
            articleVM.pages = map.get('pages');
            articleVM.hidden = map.get('hidden');
            if (createArt != null || createArt != undefined) {
                let art = createArt;
                if (art.publishedTime) {
                    let date = art.publishedTime.toString();
                    art.publishedTime = new Date(Date.parse(date.replace(/- /g, "/")));
                }
                else {
                    art.publishedTime = null;
                }
                if (art.endTime) {
                    let endTime = art.endTime.toString();
                    art.endTime = new Date(Date.parse(endTime.replace(/- /g, "/")));
                }
                if (art.startTime) {
                    let startTime = art.startTime.toString();
                    art.startTime = new Date(Date.parse(startTime.replace(/- /g, "/")));
                }
                let newArt = new Map();
                newArt = this.objToStrMap(createArt);
                let amap = new Map();
                let newArticle = art;
                articleVM.createArticle = { article: newArticle };
            }
            let updateArt = map.get('updateArt');
            if (updateArt != null || updateArt != undefined) {
                let art = updateArt;
                if (art.publishedTime) {
                    let date = art.publishedTime.toString();
                    art.publishedTime = new Date(Date.parse(date.replace(/- /g, "/")));
                }
                if (art.startTime) {
                    let startTime = art.startTime.toString();
                    art.startTime = new Date(Date.parse(startTime.replace(/- /g, "/")));
                }
                if (art.endTime) {
                    let endTime = art.endTime.toString();
                    art.endTime = new Date(Date.parse(endTime.replace(/- /g, "/")));
                }
                console.log('startTime=' + art.startTime + ",endTime=" + art.endTime);
                let newArticle = art;
                let ws = new Map();
                ws.set('obj', obj);
                let newArt = new Map();
                newArt = this.objToStrMap(updateArt);
                let amap = new Map();
                articleVM.updateArticle = { article: newArticle };
            }
            let deleteById = map.get('deleteById');
            if (deleteById != null || deleteById != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(deleteById);
                let array = amap.get('id');
                articleVM.deleteById = array;
            }
            let recycleDelete = map.get('recycleDelete');
            if (recycleDelete != null || recycleDelete != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(recycleDelete);
                let array = amap.get('id');
                articleVM.recycleDelete = array;
            }
            let reductionArticle = map.get('reductionArticle');
            if (reductionArticle != null || reductionArticle != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(reductionArticle);
                let array = amap.get('id');
                articleVM.reductionArticle = array;
            }
            let classifyTopPlace = map.get('classifyTopPlace');
            if (classifyTopPlace != null || classifyTopPlace != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(classifyTopPlace);
                let id = amap.get('id');
                const num = yield this.classifyService.classifyTopPlace(id, amap.get('display'));
                let result = `成功将${num}条数据置顶`;
                return result;
            }
            let pictureUpload = map.get('pictureUpload');
            if (pictureUpload != null || pictureUpload != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(pictureUpload);
                let ws = new Map();
                ws.set('obj', obj);
                articleVM.pictureUpload = { bucketName: amap.get('bucketName'),
                    rawName: amap.get('rawName'),
                    base64: amap.get('base64'),
                    url: ws,
                    id: amap.get('id') };
            }
            const result = yield this.sitemapService.articleCurd(articleVM);
            return JSON.stringify(result);
        });
    }
    ClassifyCU(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            let createArt = map.get('createClass');
            let classifyVM = new classify_curd_vm_1.ClassifyCurdVm();
            if (createArt != null || createArt != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(createArt);
                let useFor = amap.get('useFor');
                let id = amap.get('id');
                if (id == null || id == 0) {
                    id = 1;
                }
                classifyVM.useFor = useFor;
                if (useFor == "art") {
                    classifyVM.createClassify = { art: amap.get('createClass') };
                }
                if (useFor == 'page') {
                    classifyVM.createClassify = { page: amap.get('createClass') };
                }
            }
            let updateClass = map.get('updateClass');
            if (updateClass != null || updateClass != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(updateClass);
                let useFor = amap.get('useFor');
                let id = amap.get('id');
                if (id == null || id == 0) {
                    id = 1;
                }
                classifyVM.useFor = useFor;
                if (useFor == "art") {
                    classifyVM.updateClassify = { art: amap.get('updateClass') };
                }
                if (useFor == 'page') {
                    classifyVM.updateClassify = { page: amap.get('updateClass') };
                }
            }
            let deleteClassifyById = map.get('deleteClassifyById');
            if (deleteClassifyById != null || deleteClassifyById != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(deleteClassifyById);
                let useFor = amap.get('useFor');
                let id = amap.get('id');
                if (id == null || id == 0) {
                    id = 1;
                }
                if (id == 1)
                    throw new error_interface_1.MessageCodeError('drop:table:ById1');
                classifyVM.useFor = useFor;
                classifyVM.deleteClassify = id;
            }
            let mobileTheClassify = map.get('mobileTheClassify');
            if (mobileTheClassify != null || mobileTheClassify != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(mobileTheClassify);
                let useFor = amap.get('useFor');
                let id = amap.get('id');
                let parentId = amap.get('parentId');
                if (parentId == null || parentId == 0) {
                    parentId = 1;
                }
                classifyVM.useFor = useFor;
                classifyVM.mobileClassifyId = { id: id, parentId: parentId };
            }
            const result = yield this.sitemapService.classifyCurd(classifyVM);
            return JSON.stringify(result);
        });
    }
    PageCUD(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            let createPages = map.get('createPages');
            let createParam = new create_page_vm_1.CreatePageVm();
            if (createPages != null || createPages != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(createPages);
                let page = new page_entity_1.PageEntity();
                page.title = amap.get('title');
                page.alias = amap.get('alias');
                page.classify = amap.get('classify');
                page.classifyId = amap.get('classifyId');
                let contents = [];
                let strFinal = amap.get('content');
                for (let t in strFinal) {
                    let newContent = new page_content_entity_1.PageContentEntity;
                    newContent.content = strFinal[t];
                    contents.push(newContent);
                }
                createParam.page = page;
                createParam.content = contents;
                createParam.limit = amap.get('limitNum');
                createParam.pages = amap.get('pages');
            }
            let updatePages = map.get('updatePages');
            if (updatePages != null || updatePages != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(updatePages);
                let page = new page_entity_1.PageEntity();
                page.id = amap.get('id');
                page.title = amap.get('title');
                page.alias = amap.get('alias');
                page.classify = amap.get('classify');
                page.classifyId = amap.get('classifyId');
                let contents = [];
                let strFinal = amap.get('content');
                for (let t in strFinal) {
                    let newContent = new page_content_entity_1.PageContentEntity;
                    let amap = new Map();
                    amap = this.objToStrMap(strFinal[t]);
                    newContent.content = amap.get('content');
                    newContent.id = amap.get('id');
                    contents.push(newContent);
                }
                createParam.page = page;
                createParam.content = contents;
                createParam.limit = amap.get('limitNum');
                createParam.pages = amap.get('pages');
            }
            let deletePages = map.get('deletePages');
            if (deletePages != null || deletePages != undefined) {
                let amap = new Map();
                amap = this.objToStrMap(deletePages);
                let array = amap.get('id');
                createParam.limit = amap.get('limitNum');
                createParam.pages = amap.get('pages');
                createParam.array = array;
            }
            const result = yield this.sitemapService.pageCurd(createParam);
            return JSON.stringify(result);
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
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "createFile", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "updateFile", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "getArticlesLimit", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "getArticlesNoLimit", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CqrsResolver.prototype, "getClassifys", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "getClassifyById", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "getPagesLimit", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CqrsResolver.prototype, "getPageById", null);
__decorate([
    graphql_1.Mutation(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "ArticleCU", null);
__decorate([
    graphql_1.Mutation(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "ClassifyCU", null);
__decorate([
    graphql_1.Mutation(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "PageCUD", null);
CqrsResolver = __decorate([
    graphql_1.Resolver(),
    __metadata("design:paramtypes", [classify_service_1.ClassifyService,
        cqrs_service_1.CqrsService,
        common_paging_1.PagerService])
], CqrsResolver);
exports.CqrsResolver = CqrsResolver;
