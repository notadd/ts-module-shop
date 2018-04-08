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
const registration_service_1 = require("./registration.service");
const common_paging_1 = require("../export/common.paging");
function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}
let EnterResolver = class EnterResolver {
    constructor(registration, pagerService) {
        this.registration = registration;
        this.pagerService = pagerService;
    }
    getAllVisits(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = objToStrMap(bToJSon);
            const result = yield this.registration.getVisit(map.get('limit'), map.get('pages'));
            const paging = this.pagerService.getPager(result.totals, map.get('pages'), map.get('limit'));
            return { pagination: paging, visits: result.visits };
        });
    }
    getAllSites(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = objToStrMap(bToJSon);
            const result = yield this.registration.getSite(map.get('limit'), map.get('pages')).then(a => { return a; });
            const paging = this.pagerService.getPager(result.totals, map.get('pages'), map.get('limit'));
            return { sites: result.sites, pagination: paging };
        });
    }
    getAllBlocks(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = objToStrMap(bToJSon);
            const result = yield this.registration.getAllBlocks(map.get('limit'), map.get('pages'));
            const paging = this.pagerService.getPager(result.totals, map.get('pages'), map.get('limit'));
            return { blocks: result.blocks, pagination: paging };
        });
    }
    createBlocks(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = objToStrMap(bToJSon);
            let block = map.get('block');
            const result = yield this.registration.createBlock(block);
            return JSON.stringify(result);
        });
    }
    createSites(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = objToStrMap(bToJSon);
            let site = map.get('site');
            if (site.eventDate) {
                let date = site.eventDate.toString();
                site.eventDate = new Date(Date.parse(date.replace(/- /g, "/")));
            }
            if (site.startTime) {
                let date = site.startTime.toString();
                site.startTime = new Date(Date.parse(date.replace(/- /g, "/")));
            }
            if (site.endTime) {
                let date = site.endTime.toString();
                site.endTime = new Date(Date.parse(date.replace(/- /g, "/")));
            }
            const result = yield this.registration.createSite(site);
            return JSON.stringify(result);
        });
    }
    createVisits(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            let bToJSon = JSON.parse(str);
            let map = new Map();
            map = objToStrMap(bToJSon);
            let visit = map.get('visit');
            const result = yield this.registration.createVisit(visit);
            return JSON.stringify(result);
        });
    }
};
__decorate([
    graphql_1.Query('getAllVisits'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnterResolver.prototype, "getAllVisits", null);
__decorate([
    graphql_1.Query('getAllSites'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnterResolver.prototype, "getAllSites", null);
__decorate([
    graphql_1.Query('getAllBlocks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnterResolver.prototype, "getAllBlocks", null);
__decorate([
    graphql_1.Mutation('createBlocks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnterResolver.prototype, "createBlocks", null);
__decorate([
    graphql_1.Mutation('createSites'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnterResolver.prototype, "createSites", null);
__decorate([
    graphql_1.Mutation('createVisits'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnterResolver.prototype, "createVisits", null);
EnterResolver = __decorate([
    graphql_1.Resolver(),
    __metadata("design:paramtypes", [registration_service_1.RegistrationService,
        common_paging_1.PagerService])
], EnterResolver);
exports.EnterResolver = EnterResolver;
