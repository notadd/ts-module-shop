import {Connection} from "typeorm";
import {ClassifyEntity} from "../entity/classify.entity";

export const respositoryProvider=[
    {
        provide:"ArticleRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(ClassifyEntity),
        inject:['DbConnectionToken']
    }
]