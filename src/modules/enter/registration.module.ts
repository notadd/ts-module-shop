import {Module} from "@nestjs/common";
import {RegistrationService} from "./registration.service";
import {EnterResolver} from "./graphql.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SiteEntity} from "../entity/site.entity";
import {BlockEntity} from "../entity/block.entity";
import {VisitEntity} from "../entity/visit.entity";
import {PagerService} from "../export/common.paging";

@Module({
    imports:[TypeOrmModule.forFeature([SiteEntity,BlockEntity,VisitEntity])],
    components:[RegistrationService,EnterResolver,PagerService]
})

export class RegistrationModule{}