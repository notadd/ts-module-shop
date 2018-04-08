"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_sitemap_handler_1 = require("./create-sitemap.handler");
const update_sitemap_handler_1 = require("./update-sitemap.handler");
const page_curd_handler_1 = require("./page-curd.handler");
const get_page_handler_1 = require("./get-page.handler");
const classify_curd_handler_1 = require("./classify-curd.handler");
const article_curd_handler_1 = require("./article-curd.handler");
const get_classify_handler_1 = require("./get-classify.handler");
exports.CommandHandlers = [page_curd_handler_1.CreatePageHandler, create_sitemap_handler_1.CreateSitemapHandler,
    update_sitemap_handler_1.UpdateSitemapHandler, get_page_handler_1.GetPageHandler, classify_curd_handler_1.ClassifyCurdHandler, article_curd_handler_1.ArticleCurdHandler,
    get_classify_handler_1.GetClassifyHandler];
