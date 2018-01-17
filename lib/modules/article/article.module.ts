import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {ArticleController} from "./article.controller";
import {respositoryProvider} from "./respository.provider";
import {ArticleService} from "./article.service";

@Module({
    modules:[DatabaseModule],
    controllers:[ArticleController],
    components:[...respositoryProvider,ArticleService],
    exports:[ArticleService]
})

export class ArticleModule{}