import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {hisrespositoryProvider} from "./history.repository";
import {HistoryService} from "./history.service";

@Module({
    modules:[DatabaseModule],
    components:[...hisrespositoryProvider,HistoryService],
    exports:[HistoryService]
})

export class HistoryModule{}