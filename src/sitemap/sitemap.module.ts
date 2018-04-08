import {Module} from "@nestjs/common";
import {SitemapService} from "./sitemap.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ArticleEntity} from "../entity/article.entity";
import {PageEntity} from "../entity/page.entity";
import {SitemapEntity} from "../entity/sitemap.entity";

@Module({
    imports:[TypeOrmModule.forFeature([ArticleEntity,PageEntity,SitemapEntity])],
    components:[SitemapService],
    exports:[SitemapService]
})
export class SiteMapModule{}