import {Connection} from "typeorm";
import {PageEntity} from "../entity/page.entity";
import {PageContentEntity} from "../entity/page.content.entity";

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