import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {ArticleController} from "./article.controller";
import {respositoryProvider} from "./respository.provider";
import {ArticleService} from "./article.service";
import {HistoryModule} from "../history/history.module";


@Module({
    modules:[DatabaseModule,HistoryModule],
    controllers:[ArticleController],
    components:[...respositoryProvider,ArticleService],
    exports:[ArticleService]
})

export class ArticleModule{}