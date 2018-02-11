import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {SitemapController} from "./sitemap.controller";
import {SitemapService} from "./sitemap.service";
import {artRespositoryProvider} from "./respository.provider";
import {pageRespositoryProvider} from "./respository.provider";
import {siteRespositoryProvider} from "./respository.provider";

@Module({
    modules:[DatabaseModule],
    controllers:[SitemapController],
    components:[SitemapService,...artRespositoryProvider,...pageRespositoryProvider,...siteRespositoryProvider],
    exports:[SitemapService]
})
export class SiteMapModule{}