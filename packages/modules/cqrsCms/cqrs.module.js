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
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const cqrs_2 = require("@nestjs/cqrs");
const cqrs_resolver_1 = require("./cqrs.resolver");
const cqrs_service_1 = require("./cqrs.service");
const core_1 = require("@nestjs/core");
const pageRepository_1 = require("./repository/pageRepository");
const handlers_1 = require("./commands/handlers");
const page_sagas_1 = require("./sagas/page.sagas");
const handlers_2 = require("./events/handlers");
const sitemap_module_1 = require("../sitemap/sitemap.module");
const article_service_1 = require("./service/article.service");
const classify_service_1 = require("./service/classify.service");
const page_service_1 = require("./service/page.service");
const typeorm_1 = require("@nestjs/typeorm");
const article_entity_1 = require("../entity/article.entity");
const page_entity_1 = require("../entity/page.entity");
const classify_entity_1 = require("../entity/classify.entity");
const pageClassify_entity_1 = require("../entity/pageClassify.entity");
const page_content_entity_1 = require("../entity/page.content.entity");
const common_paging_1 = require("../export/common.paging");
let CqrsModule = class CqrsModule {
    constructor(moduleRef, command$, event$) {
        this.moduleRef = moduleRef;
        this.command$ = command$;
        this.event$ = event$;
    }
    onModuleInit() {
        this.command$.setModuleRef(this.moduleRef);
        this.event$.setModuleRef(this.moduleRef);
        this.event$.register(handlers_2.EventHandlers);
        this.command$.register(handlers_1.CommandHandlers);
    }
};
CqrsModule = __decorate([
    common_1.Module({
        imports: [cqrs_2.CQRSModule, sitemap_module_1.SiteMapModule, typeorm_1.TypeOrmModule.forFeature([article_entity_1.ArticleEntity, classify_entity_1.ClassifyEntity, page_entity_1.PageEntity, pageClassify_entity_1.PageClassifyEntity, page_content_entity_1.PageContentEntity])],
        components: [article_service_1.ArticleService, classify_service_1.ClassifyService, page_service_1.PageService, cqrs_resolver_1.CqrsResolver, cqrs_service_1.CqrsService, pageRepository_1.PageRepository, ...handlers_1.CommandHandlers, ...handlers_2.EventHandlers, page_sagas_1.PageSagas, common_paging_1.PagerService]
    }),
    __metadata("design:paramtypes", [core_1.ModuleRef,
        cqrs_1.CommandBus,
        cqrs_1.EventBus])
], CqrsModule);
exports.CqrsModule = CqrsModule;
