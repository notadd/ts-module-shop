import {Module} from "@nestjs/common";
import {databaseProvider} from "./database.provider";
import {PagerService} from "./common.paging";

@Module({
    components:[...databaseProvider,PagerService],
    exports:[...databaseProvider,PagerService]
})

export class DatabaseModule{}