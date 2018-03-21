"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cqrs_1 = require("@nestjs/cqrs");
const page_curd_event_1 = require("../events/impl/page-curd.event");
const classify_curd_events_1 = require("../events/impl/classify-curd.events");
const article_curd_events_1 = require("../events/impl/article-curd.events");
const sitemap_update_event_1 = require("../events/impl/sitemap-update.event");
const clc = require('cli-color');
class Page extends cqrs_1.AggregateRoot {
    constructor(id) {
        super();
        this.id = id;
    }
    createPage(data) {
        this.apply(new page_curd_event_1.PageCurdEvent(data));
        this.apply(new sitemap_update_event_1.SitemapUpdateEvent('0'));
    }
    createClassify(data) {
        this.apply(new classify_curd_events_1.ClassifyCurdEvents(data));
    }
    createArticle(data) {
        this.apply(new article_curd_events_1.ArticleCurdEvents(data));
        this.apply(new sitemap_update_event_1.SitemapUpdateEvent('0'));
    }
}
exports.Page = Page;
