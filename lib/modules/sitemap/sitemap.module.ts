import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {SitemapService} from "./sitemap.service";
import {artRespositoryProvider} from "./respository.provider";
import {pageRespositoryProvider} from "./respository.provider";
import {siteRespositoryProvider} from "./respository.provider";

@Module({
    modules:[DatabaseModule],
    components:[SitemapService,...artRespositoryProvider,...pageRespositoryProvider,...siteRespositoryProvider],
    exports:[SitemapService]
})
export class SiteMapModule{}