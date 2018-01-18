import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {ClassifyController} from "./classify.controller";
import {respositoryProvider} from "./respository.provider";
import {ClassifyService} from "./classify.service";

@Module({
    modules:[DatabaseModule],
    controllers:[ClassifyController],
    components:[...respositoryProvider,ClassifyService],
    exports:[ClassifyService]
})

export class ClassifyModule{}