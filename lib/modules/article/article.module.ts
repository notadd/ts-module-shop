import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {respositoryProvider} from "./respository.provider";
import {ArticleService} from "./article.service";
import {ClassifyModule} from "../classify/classify.module";
import { StoreComponentProvider} from "../ext-local-store/src/export/StoreComponentProvider";



@Module({

    modules:[DatabaseModule,ClassifyModule],
    components:[...respositoryProvider,ArticleService],
    exports:[ArticleService],
    imports:[StoreComponentProvider]
})

export class ArticleModule{}