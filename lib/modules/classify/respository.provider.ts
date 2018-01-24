import {Connection} from "typeorm";
import {ClassifyEntity} from "../entity/classify.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {PageEntity} from "../entity/page.entity";

export const clarespositoryProvider=[
    {
        provide:"ClassifyRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(ClassifyEntity),
        inject:['DbConnectionToken']
    }
]

export const pageClassifyProvider=[{
    provide:"PageClassifyRepositoryToken",
    useFactory:(connection:Connection) =>connection.getRepository(PageClassifyEntity),
    inject:['DbConnectionToken']
}]

export const pagerespositoryProvider=[
    {
        provide:"PageRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(PageEntity),
        inject:['DbConnectionToken']
    }
]