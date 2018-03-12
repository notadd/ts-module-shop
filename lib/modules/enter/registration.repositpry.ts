import {Connection} from "typeorm";
import {BlockEntity} from "../entity/block.entity";
import {ArticleEntity} from "../entity/article.entity";
import {VisitEntity} from "../entity/visit.entity";
import {SiteEntity} from "../entity/site.entity";

export const blockRespositoryProvider=[
    {
        provide:"BlockRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(BlockEntity),
        inject:['DbConnectionToken']
    }
];

export const visitRespositoryProvider=[
    {
        provide:"VisitRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(VisitEntity),
        inject:['DbConnectionToken']
    }
];
export const siterespositoryProvider=[
    {
        provide:"fieldRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(SiteEntity),
        inject:['DbConnectionToken']
    }
]





