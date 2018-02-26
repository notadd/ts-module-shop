/*import {PageDeleteHandler} from "./page-delete.handler";
import {PageCreateHandler} from "./page-create.handler";*/
import {SitemapCreateHandler} from "./sitemap-create.handler";
import {SitemapUpdateHandler} from "./sitemap-update.handler";
import {PageCurdHandle} from "./page-curd.handler";
import {ClassifyCurdEvent} from "./classify-curd.handler";
import {ArticleCurdEvent} from "./article-curd.handler";

export const EventHandlers=[/*PageDeleteHandler,PageCreateHandler,*/SitemapCreateHandler,SitemapUpdateHandler,PageCurdHandle,ClassifyCurdEvent,ArticleCurdEvent];