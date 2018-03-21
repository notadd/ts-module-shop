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
const article_entity_1 = require("../entity/article.entity");
const page_entity_1 = require("../entity/page.entity");
const sitemap_entity_1 = require("../entity/sitemap.entity");
const typeorm_2 = require("@nestjs/typeorm");
let SitemapService = class SitemapService {
    constructor(artRepository, pageRepository, siteRepository) {
        this.artRepository = artRepository;
        this.pageRepository = pageRepository;
        this.siteRepository = siteRepository;
    }
    commitXML(array_baidu_sitemap_options, url) {
        return __awaiter(this, void 0, void 0, function* () {
            let sitemap = yield this.siteRepository.findOneById(1);
            if (sitemap == null) {
                sitemap = array_baidu_sitemap_options;
                let fileName;
                if (array_baidu_sitemap_options['lc_XML_FileName']) {
                    fileName = 'sitemap_baidu';
                }
                else {
                    fileName = 'sitemap';
                }
                sitemap.lc_XML_FileName = fileName;
                yield this.siteRepository.insert(sitemap);
            }
            else {
                sitemap = array_baidu_sitemap_options;
                let fileName;
                if (array_baidu_sitemap_options['lc_XML_FileName']) {
                    fileName = 'sitemap_baidu';
                }
                else {
                    fileName = 'sitemap';
                }
                sitemap.lc_XML_FileName = fileName;
                if (array_baidu_sitemap_options['lc_is_Enabled_XML_Sitemap'])
                    sitemap.lc_is_Enabled_XML_Sitemap = array_baidu_sitemap_options['lc_is_Enabled_XML_Sitemap'];
                if (array_baidu_sitemap_options['lc_page_select'])
                    sitemap.lc_page_select = array_baidu_sitemap_options['lc_page_select'];
                if (array_baidu_sitemap_options['lc_post_select'])
                    sitemap.lc_post_select = array_baidu_sitemap_options['lc_post_select'];
                if (array_baidu_sitemap_options['lc_is_update_sitemap_when_post'])
                    sitemap.lc_is_update_sitemap_when_post = array_baidu_sitemap_options['lc_is_update_sitemap_when_post'];
                if (array_baidu_sitemap_options['lc_post_limit1000'])
                    sitemap.lc_post_limit1000 = array_baidu_sitemap_options['lc_post_limit1000'];
                yield this.siteRepository.updateById(1, sitemap);
            }
        });
    }
    UpdateXMLFile($mes = 0, url) {
        return __awaiter(this, void 0, void 0, function* () {
            let sitemap = yield this.siteRepository.findOneById(1);
            if (sitemap.lc_is_Enabled_XML_Sitemap) {
                this.buildSitemapXml(url);
            }
        });
    }
    getBaiduOptions(getBaiduOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            getBaiduOptions = yield this.siteRepository.findOneById(1);
            let array_baidu_sitemap_options = new Array();
            if (getBaiduOptions) {
                array_baidu_sitemap_options = getBaiduOptions;
            }
            else {
                if (!array_baidu_sitemap_options['lc_XML_FileName']) {
                    array_baidu_sitemap_options['lc_XML_FileName'] = 'sitemap_baidu';
                }
                if (!array_baidu_sitemap_options['lc_is_Enabled_XML_Sitemap']) {
                    array_baidu_sitemap_options['lc_is_Enabled_XML_Sitemap'] = '1';
                }
                if (!array_baidu_sitemap_options['lc_is_update_sitemap_when_post']) {
                    array_baidu_sitemap_options['lc_is_update_sitemap_when_post'] = '1';
                }
                if (!array_baidu_sitemap_options['lc_post_limit1000']) {
                    array_baidu_sitemap_options['lc_post_limit1000'] = '1';
                }
                if (!array_baidu_sitemap_options['lc_post_select']) {
                    array_baidu_sitemap_options['lc_post_select'] = '1';
                }
                if (!array_baidu_sitemap_options['lc_page_select']) {
                    array_baidu_sitemap_options['lc_page_select'] = '1';
                }
                if (!array_baidu_sitemap_options['lc_category_select']) {
                    array_baidu_sitemap_options['lc_category_select'] = '1';
                }
            }
            return array_baidu_sitemap_options;
        });
    }
    buildSitemapXml(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let array_baidu_sitemap_options = yield this.getBaiduOptions().then(a => { return a; });
            let lc_limit;
            if (array_baidu_sitemap_options['lc_post_limit1000']) {
                lc_limit = 1000;
            }
            else {
                lc_limit = 10000;
            }
            let fs = require('fs');
            let file = `${(__dirname).substring(0, (__dirname).lastIndexOf('modules'))}modules/public/`;
            let ws = fs.createWriteStream(`${file}${array_baidu_sitemap_options['lc_XML_FileName']}.xml`);
            let builder = require('xmlbuilder');
            let root = builder.create('urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
            let num = 1;
            if (array_baidu_sitemap_options['lc_post_select']) {
                let mini = yield this.artRepository.createQueryBuilder('art').orderBy('art.updateAt', 'DESC').limit(lc_limit / 2).getMany();
                for (let t in mini) {
                    let newTime = mini[t].updateAt;
                    let update = new Date(newTime.getTime() + newTime.getTimezoneOffset() * 2 * 30 * 1000);
                    let item = root.ele('url');
                    let sequence = num++;
                    item.ele('sequence', sequence);
                    item.ele('loc', `${url.replace('"', "").replace('"', '')}/${mini[t].name}`);
                    item.ele('changefreq', 'weekly');
                    item.ele('lastmod', `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`);
                }
            }
            if (array_baidu_sitemap_options['lc_page_select']) {
                let mini = yield this.pageRepository.createQueryBuilder('page').orderBy('page.updateAt', 'DESC').limit(lc_limit / 2).getMany();
                for (let t in mini) {
                    let newTime = mini[t].updateAt;
                    let update = new Date(newTime.getTime() + newTime.getTimezoneOffset() * 2 * 30 * 1000);
                    let item = root.ele('url');
                    let sequence = num++;
                    item.ele('sequence', sequence);
                    item.ele('loc', `${url.replace('"', "").replace('"', '')}/${mini[t].title}`);
                    item.ele('changefreq', 'weekly');
                    item.ele('lastmod', `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`);
                }
            }
            root.end({ pretty: false });
            ws.write(`<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="./sitemap.xsl"?>\n${root.toString().substring(0, root.toString().lastIndexOf('urlset') + 6)}>`);
            ws.end();
        });
    }
};
SitemapService = __decorate([
    common_1.Component(),
    __param(0, typeorm_2.InjectRepository(article_entity_1.ArticleEntity)),
    __param(1, typeorm_2.InjectRepository(page_entity_1.PageEntity)),
    __param(2, typeorm_2.InjectRepository(sitemap_entity_1.SitemapEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], SitemapService);
exports.SitemapService = SitemapService;
