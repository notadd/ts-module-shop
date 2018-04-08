import { CreateSitemapHandler } from "./create-sitemap.handler";
import { UpdateSitemapHandler } from "./update-sitemap.handler";
import { CreatePageHandler } from "./page-curd.handler";
import { GetPageHandler } from "./get-page.handler";
import { ClassifyCurdHandler } from "./classify-curd.handler";
import { ArticleCurdHandler } from "./article-curd.handler";
import { GetClassifyHandler } from "./get-classify.handler";
export declare const CommandHandlers: (typeof CreateSitemapHandler | typeof UpdateSitemapHandler | typeof CreatePageHandler | typeof GetPageHandler | typeof ClassifyCurdHandler | typeof ArticleCurdHandler | typeof GetClassifyHandler)[];
