import { SitemapCreateHandler } from "./sitemap-create.handler";
import { SitemapUpdateHandler } from "./sitemap-update.handler";
import { PageCurdHandle } from "./page-curd.handler";
import { ClassifyCurdEvent } from "./classify-curd.handler";
import { ArticleCurdEvent } from "./article-curd.handler";
export declare const EventHandlers: (typeof SitemapCreateHandler | typeof SitemapUpdateHandler | typeof PageCurdHandle | typeof ClassifyCurdEvent | typeof ArticleCurdEvent)[];
