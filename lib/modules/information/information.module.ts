import {Module} from "@nestjs/common";
import {DatabaseModule} from "../database/database.module";
import {InformationController} from "./information.controller";
import {InformationService} from "./information.service";
import {inforespositoryProvider} from "./repository.provider";

@Module({
    modules:[DatabaseModule],
    controllers:[InformationController],
    components:[InformationService,...inforespositoryProvider],
    exports:[InformationService]
})

export class InformationModule{}