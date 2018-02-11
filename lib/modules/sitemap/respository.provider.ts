import {Connection} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";
import {PageEntity} from "../entity/page.entity";
import {SitemapEntity} from "../entity/sitemap.entity";

export const artRespositoryProvider=[
    {
        provide:"ArticleRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(ArticleEntity),
        inject:['DbConnectionToken']
    }
]
export const pageRespositoryProvider=[
    {
        provide:"PageRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(PageEntity),
        inject:['DbConnectionToken']
    }
]
export const siteRespositoryProvider=[
    {
        provide:"SiteRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(SitemapEntity),
        inject:['DbConnectionToken']
    }
]