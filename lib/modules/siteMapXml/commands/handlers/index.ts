/*import {DeletePageHandler} from "./delete-page.handler";
import {CreatePageHandler} from "./create-page.handler";*/
import {CreateSitemapHandler} from "./create-sitemap.handler";
import {UpdateSitemapHandler} from "./update-sitemap.handler";
import {CreatePageHandler} from "./create-page.handler";
import {GetPageHandler} from "./get-page.handler";

export const CommandHandlers = [CreatePageHandler,CreateSitemapHandler,UpdateSitemapHandler,GetPageHandler];