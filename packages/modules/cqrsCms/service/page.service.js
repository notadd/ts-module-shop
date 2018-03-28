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
const page_entity_1 = require("../../entity/page.entity");
const error_interface_1 = require("../errorMessage/error.interface");
const pageClassify_entity_1 = require("../../entity/pageClassify.entity");
const classify_service_1 = require("./classify.service");
const page_content_entity_1 = require("../../entity/page.content.entity");
const typeorm_2 = require("@nestjs/typeorm");
let PageService = class PageService {
    constructor(repository, classifyService, contentRepository, pageRepository) {
        this.repository = repository;
        this.classifyService = classifyService;
        this.contentRepository = contentRepository;
        this.pageRepository = pageRepository;
    }
    getAllPage(limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let pages = yield this.repository.createQueryBuilder().orderBy('"updateAt"', 'DESC').skip(limit * (page - 1)).take(limit).getMany();
            let title = yield this.repository.createQueryBuilder().getCount();
            return { pages: pages, totalItems: title };
        });
    }
    serachKeywords(keywords, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let words = `%${keywords}%`;
            let pages = yield this.repository.createQueryBuilder().where('"title"like :title', { title: words }).orderBy('"updateAt"', 'DESC').skip(limit * (page - 1)).take(limit).getMany();
            let title = yield this.repository.createQueryBuilder().where('"title"like :title', { title: words }).getCount();
            return { pages: pages, totalItems: title };
        });
    }
    deletePages(array, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let t in array) {
                let page = yield this.repository.findOneById(array[t]);
                if (page == null)
                    throw new error_interface_1.MessageCodeError('delete:page:deleteById');
                yield this.contentRepository.createQueryBuilder().delete().from(page_content_entity_1.PageContentEntity).where('"parentId"= :parentId', { parentId: page.id }).execute();
                this.repository.deleteById(page.id);
            }
        });
    }
    createPages(page, contents, limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page.title == null)
                throw new error_interface_1.MessageCodeError('create:page:missingTitle');
            if (page.alias == null)
                throw new error_interface_1.MessageCodeError('create:page:missingAlias');
            let entity = yield this.classifyService.findOneByIdPage(page.classifyId);
            if (page.classifyId != null && page.classifyId != 0 && entity == null)
                throw new error_interface_1.MessageCodeError('page:classify:classifyIdMissing');
            if (entity == null)
                throw new error_interface_1.MessageCodeError('update:classify:updateById');
            let aliasEntity = yield this.repository.createQueryBuilder().where('"alias"= :alias', { alias: page.alias }).getMany();
            if (aliasEntity.length > 0)
                throw new error_interface_1.MessageCodeError('create:classify:aliasRepeat');
            let id = yield this.repository.save(page).then(a => { return a.id; });
            for (let t in contents) {
                let newContent = new page_content_entity_1.PageContentEntity();
                newContent = contents[t];
                newContent.parentId = id;
                yield this.contentRepository.save(newContent);
            }
        });
    }
    curdCheck(alias, classifyId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            let update = true;
            if (alias) {
                let aliasEntity = yield this.repository.createQueryBuilder().where('"alias"= :alias', { alias: alias }).getMany();
                if (aliasEntity.length > 0)
                    result = "别名不能重复";
                update = false;
            }
            if (classifyId) {
                let entity = yield this.classifyService.findOneByIdPage(classifyId);
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
    updatePages(page, content, limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityPage = yield this.repository.findOneById(page.id);
            if (entityPage == null)
                throw new error_interface_1.MessageCodeError('delete:page:deleteById');
            let aliasEntity = yield this.repository.createQueryBuilder().where('"alias"= :alias', { alias: page.alias }).getMany();
            if (aliasEntity.length > 0)
                throw new error_interface_1.MessageCodeError('create:classify:aliasRepeat');
            let entity = yield this.classifyService.findOneByIdPage(page.classifyId);
            if (page.classifyId != null && page.classifyId != 0 && entity == null)
                throw new error_interface_1.MessageCodeError('page:classify:classifyIdMissing');
            page.updateAt = new Date();
            for (let t in content) {
                if (content[t].id == 0) {
                    let newContent = new page_content_entity_1.PageContentEntity();
                    newContent = content[t];
                    newContent.parentId = page.id;
                    yield this.contentRepository.insert(newContent);
                }
                else {
                    let newContent = new page_content_entity_1.PageContentEntity();
                    newContent = content[t];
                    newContent.parentId = page.id;
                    newContent.updateAt = new Date();
                    yield this.contentRepository.updateById(newContent.id, newContent);
                }
            }
            if (page.alias == null)
                page.alias = entityPage.alias;
            if (page.title == null)
                page.title = entityPage.title;
            if (page.classifyId == null)
                page.classifyId = entityPage.classifyId;
            if (page.classify == null)
                page.classify = entityPage.classify;
            let newPage = page;
            try {
                yield this.repository.updateById(entityPage.id, newPage);
            }
            catch (error) {
                throw new error_interface_1.MessageCodeError('dataBase:curd:error');
            }
        });
    }
    findPageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = yield this.repository.findOneById(id);
            if (entity == null)
                throw new error_interface_1.MessageCodeError('delete:page:deleteById');
            let result = yield this.repository.findOneById(id, { relations: ['contents'] });
            return result;
        });
    }
    findPageByClassifyId(id, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityClassify = yield this.classifyService.findOnePageClassifyById(id);
            if (entityClassify == null)
                throw new error_interface_1.MessageCodeError('delete:page:deleteById');
            let array = yield this.getClassifyId(id).then(a => { return a; });
            array.push(id);
            let newArray = Array.from(new Set(array));
            let entity = yield this.repository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).orderBy('"updateAt"', 'DESC').skip(limit * (page - 1)).take(limit).getMany();
            let title = yield this.repository.createQueryBuilder().where('"classifyId" in (:id)', { id: newArray }).getCount();
            return { pages: entity, totalItems: title };
        });
    }
    getClassifyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
            const result = yield this.pageRepository.createQueryBuilder('page_classify_table').where('page_classify_table.id= :id', { id: id }).innerJoinAndSelect('page_classify_table.children', 'children').orderBy('page_classify_table.id').getMany();
            let firstArray = result;
            let array = [];
            for (let t in firstArray) {
                array.push(firstArray[t].id);
                if (firstArray[t].children.length > 0) {
                    for (let h in firstArray[t].children) {
                        array.push(firstArray[t].children[h].id);
                        array.push(...yield this.getClassifyId(firstArray[t].children[h].id));
                    }
                }
            }
            return array;
        });
    }
};
PageService = __decorate([
    common_1.Component(),
    __param(0, typeorm_2.InjectRepository(page_entity_1.PageEntity)),
    __param(2, typeorm_2.InjectRepository(page_content_entity_1.PageContentEntity)),
    __param(3, typeorm_2.InjectRepository(pageClassify_entity_1.PageClassifyEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        classify_service_1.ClassifyService,
        typeorm_1.Repository,
        typeorm_1.Repository])
], PageService);
exports.PageService = PageService;
