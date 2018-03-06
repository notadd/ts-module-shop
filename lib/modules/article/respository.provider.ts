import {Connection} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";

export const respositoryProvider=[
    {
        provide:"ArticleRepositoryToken",
        useFactory:(connection:Connection) =>connection.getRepository(ArticleEntity),
        inject:['DbConnectionToken']
    }
]
