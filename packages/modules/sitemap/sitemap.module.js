"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const sitemap_service_1 = require("./sitemap.service");
const typeorm_1 = require("@nestjs/typeorm");
const article_entity_1 = require("../entity/article.entity");
const page_entity_1 = require("../entity/page.entity");
const sitemap_entity_1 = require("../entity/sitemap.entity");
let SiteMapModule = class SiteMapModule {
};
SiteMapModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([article_entity_1.ArticleEntity, page_entity_1.PageEntity, sitemap_entity_1.SitemapEntity])],
        components: [sitemap_service_1.SitemapService],
        exports: [sitemap_service_1.SitemapService]
    })
], SiteMapModule);
exports.SiteMapModule = SiteMapModule;
