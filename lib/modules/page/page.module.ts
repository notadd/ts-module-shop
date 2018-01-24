import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {PageController} from "./page.controller";
import {PageService} from "./page.service";
import {pagerespositoryProvider} from "./repository.provider";
import {HistoryModule} from "../history/history.module";
import {ClassifyModule} from "../classify/classify.module";

@Module({
    modules:[DatabaseModule,HistoryModule,ClassifyModule],
    controllers:[PageController],
    components:[...pagerespositoryProvider,PageService],
    exports:[PageService]
})
export class PageModule{}