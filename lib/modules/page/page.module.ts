import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {PageController} from "./page.controller";
import {PageService} from "./page.service";
import {pagerespositoryProvider} from "./repository.provider";

@Module({
    modules:[DatabaseModule],
    controllers:[PageController],
    components:[PageService,...pagerespositoryProvider],
    exports:[PageService]
})
export class PageModule{}