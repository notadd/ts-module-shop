import {Connection} from "typeorm";
import {PageEntity} from "../entity/page.entity";

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
        useFactory:(connection:Connection) =>connection.getRepository(PageEntity),
        inject:['DbConnectionToken']
    }
]