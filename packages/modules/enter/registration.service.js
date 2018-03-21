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
const block_entity_1 = require("../entity/block.entity");
const site_entity_1 = require("../entity/site.entity");
const visit_entity_1 = require("../entity/visit.entity");
const common_paging_1 = require("../export/common.paging");
const typeorm_2 = require("@nestjs/typeorm");
let RegistrationService = class RegistrationService {
    constructor(blockRespository, siteRespository, visitRespository, pageService) {
        this.blockRespository = blockRespository;
        this.siteRespository = siteRespository;
        this.visitRespository = visitRespository;
        this.pageService = pageService;
    }
    createBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            let code;
            try {
                block.collapse = false;
                yield this.blockRespository.save(block);
                message = "添加成功";
                code = 200;
            }
            catch (err) {
                message = "添加失败";
                code = 500;
            }
            return { MessageCodeError: message, Code: code };
        });
    }
    createSite(site) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            let code;
            let time = site.startTime;
            site.startTime = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
            let newTime = site.endTime;
            site.endTime = new Date(newTime.getTime() - newTime.getTimezoneOffset() * 60 * 1000);
            try {
                site.collapse = false;
                yield this.siteRespository.save(site);
                message = "添加成功";
                code = 200;
            }
            catch (err) {
                message = "添加失败";
                code = 500;
            }
            return { MessageCodeError: message, Code: code };
        });
    }
    createVisit(visit) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            let code;
            try {
                visit.collapse = false;
                yield this.visitRespository.save(visit);
                message = "添加成功";
                code = 200;
            }
            catch (err) {
                message = "添加失败";
                code = 500;
            }
            return { MessageCodeError: message, Code: code };
        });
    }
    getAllBlocks(limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.blockRespository.createQueryBuilder().orderBy('"id"', 'ASC').skip(limit * (pages - 1)).take(limit).getManyAndCount().then(a => { return a; });
            let str = JSON.stringify(result);
            let num = str.substring(str.lastIndexOf(',') + 1, str.lastIndexOf(']'));
            let block = Array.from(JSON.parse(str.substring(str.indexOf('[') + 1, str.lastIndexOf(','))));
            return { blocks: block, totals: Number(num) };
        });
    }
    getSite(limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.siteRespository.createQueryBuilder().orderBy('"id"', 'ASC').skip(limit * (pages - 1)).take(limit).getManyAndCount();
            let str = JSON.stringify(result);
            let num = str.substring(str.lastIndexOf(',') + 1, str.lastIndexOf(']'));
            let site = Array.from(JSON.parse(str.substring(str.indexOf('[') + 1, str.lastIndexOf(','))));
            return { sites: site, totals: Number(num) };
        });
    }
    getVisit(limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.visitRespository.createQueryBuilder().orderBy('"id"', 'ASC').skip(limit * (pages - 1)).take(limit).getManyAndCount();
            let str = JSON.stringify(result);
            let num = str.substring(str.lastIndexOf(',') + 1, str.lastIndexOf(']'));
            let visit = Array.from(JSON.parse(str.substring(str.indexOf('[') + 1, str.lastIndexOf(','))));
            return { visits: visit, totals: Number(num) };
        });
    }
    pagingMethod(totalItems, limit, page) {
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
};
RegistrationService = __decorate([
    common_1.Component(),
    __param(0, typeorm_2.InjectRepository(block_entity_1.BlockEntity)),
    __param(1, typeorm_2.InjectRepository(site_entity_1.SiteEntity)),
    __param(2, typeorm_2.InjectRepository(visit_entity_1.VisitEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        common_paging_1.PagerService])
], RegistrationService);
exports.RegistrationService = RegistrationService;
