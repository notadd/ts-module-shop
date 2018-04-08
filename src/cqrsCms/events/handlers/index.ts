import {SitemapCreateHandler} from "./sitemap-create.handler";
import {SitemapUpdateHandler} from "./sitemap-update.handler";
import {PageCurdHandle} from "./page-curd.handler";
import {ClassifyCurdEvent} from "./classify-curd.handler";
import {ArticleCurdEvent} from "./article-curd.handler";

export const EventHandlers=[SitemapCreateHandler,SitemapUpdateHandler,PageCurdHandle,ClassifyCurdEvent,ArticleCurdEvent];