import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {respositoryProvider} from "./respository.provider";
import {ArticleService} from "./article.service";
import {ClassifyModule} from "../classify/classify.module";
import {LocalModule} from "../ext-local-store/src/LocalModule";



@Module({

    modules:[DatabaseModule,ClassifyModule,LocalModule],
    components:[...respositoryProvider,ArticleService],
    exports:[ArticleService],
})

export class ArticleModule{}