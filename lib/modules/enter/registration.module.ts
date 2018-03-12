import {Module} from "@nestjs/common";
import {blockRespositoryProvider, siterespositoryProvider, visitRespositoryProvider} from "./registration.repositpry";
import {DatabaseModule} from "../database/database.module";
import {RegistrationService} from "./registration.service";
import {EnterResolver} from "./graphql.resolver";

@Module({
    modules:[DatabaseModule],
    components:[...siterespositoryProvider,...visitRespositoryProvider,...blockRespositoryProvider,RegistrationService,EnterResolver]
})

export class RegistrationModule{}