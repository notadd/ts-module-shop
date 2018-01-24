import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {ClassifyController} from "./classify.controller";
import {clarespositoryProvider} from "./respository.provider";
import {ClassifyService} from "./classify.service";
import {respositoryProvider} from "../article/respository.provider";
import {pageClassifyProvider} from "./respository.provider";
import {pagerespositoryProvider} from "./respository.provider";

@Module({
    modules:[DatabaseModule],
    controllers:[ClassifyController],
    components:[...clarespositoryProvider,...respositoryProvider,...pageClassifyProvider,...pagerespositoryProvider,ClassifyService],
    exports:[ClassifyService]
})

export class ClassifyModule{}