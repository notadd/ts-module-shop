import {Connection} from "typeorm";
import {PageEntity} from "../entity/page.entity";
import {PageContentEntity} from "../entity/page.content.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";

export const pagerespositoryProvider=[
    {
        provide:"PageRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(PageEntity),
        inject:['DbConnectionToken']
    }
]
export const contentrespositoryProvider=[
    {
        provide:"ContentRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(PageContentEntity),
        inject:['DbConnectionToken']
    }
]
export const pageClassifyProvider=[{
    provide:"PageClassifyRepositoryToken",
    useFactory:(connection:Connection) =>connection.getRepository(PageClassifyEntity),
    inject:['DbConnectionToken']
}]