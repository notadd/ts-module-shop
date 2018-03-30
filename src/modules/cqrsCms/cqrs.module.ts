import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Module, OnModuleInit } from "@nestjs/common";
import { CQRSModule } from "@nestjs/cqrs";
import { CqrsResolver } from "./cqrs.resolver";
import { CqrsService } from "./cqrs.service";
import { ModuleRef } from '@nestjs/core';
import { PageRepository } from "./repository/pageRepository";
import { CommandHandlers } from "./commands/handlers";
import { PageSagas } from "./sagas/page.sagas";
import { EventHandlers } from "./events/handlers";
import { SiteMapModule } from "../sitemap/sitemap.module";
import { ArticleService } from "./service/article.service";
import { ClassifyService } from "./service/classify.service";
import { PageService } from "./service/page.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "../entity/article.entity";
import { PageEntity } from "../entity/page.entity";
import { ClassifyEntity } from "../entity/classify.entity";
import { PageClassifyEntity } from "../entity/pageClassify.entity";
import { PageContentEntity } from "../entity/page.content.entity";
import { PagerService } from "../export/common.paging";


@Module({
    imports:[CQRSModule,SiteMapModule,TypeOrmModule.forFeature([ArticleEntity,ClassifyEntity,PageEntity,PageClassifyEntity,PageContentEntity])],
    components:[ArticleService,ClassifyService,PageService,CqrsResolver,CqrsService,PageRepository,...CommandHandlers,...EventHandlers,PageSagas,PagerService]
})
export class CqrsModule implements OnModuleInit{
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly command$: CommandBus,
        private readonly event$: EventBus,
       // private readonly PageSagas: PageSagas,
    ) {}
    onModuleInit() {
        this.command$.setModuleRef(this.moduleRef);
        this.event$.setModuleRef(this.moduleRef);

        this.event$.register(EventHandlers);
        this.command$.register(CommandHandlers);
       // this.event$.combineSagas([this.PageSagas.articleXml,this.PageSagas.pageXml/*,this.PageSagas.getPages,this.PageSagas.getArticles,this.PageSagas.getClassification*/]);
    }
}
