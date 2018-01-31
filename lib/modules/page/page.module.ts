import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {PageController} from "./page.controller";
import {PageService} from "./page.service";
import {pagerespositoryProvider} from "./repository.provider";
import {contentrespositoryProvider} from "./repository.provider";
import {HistoryModule} from "../history/history.module";
import {ClassifyModule} from "../classify/classify.module";
import {pageClassifyProvider} from "../classify/respository.provider";

@Module({
    modules:[DatabaseModule,HistoryModule,ClassifyModule],
    controllers:[PageController],
    components:[...pagerespositoryProvider,...contentrespositoryProvider,...pageClassifyProvider,PageService],
    exports:[PageService]
})
export class PageModule{}