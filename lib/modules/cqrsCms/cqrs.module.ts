import { CommandBus, EventBus } from '@nestjs/cqrs';
import {Module, OnModuleInit} from "@nestjs/common";
import {CQRSModule} from "@nestjs/cqrs";
import {CqrsResolver} from "./cqrs.resolver";
import {CqrsService} from "./cqrs.service";
import { ModuleRef } from '@nestjs/core';
import {PageRepository} from "./repository/pageRepository";
import {CommandHandlers} from "./commands/handlers";
import {PageSagas} from "./sagas/page.sagas";
import {EventHandlers} from "./events/handlers";
import {PageModule} from "../page/page.module";
import {ClassifyModule} from "../classify/classify.module";
import {ArticleModule} from "../article/article.module";
import {SiteMapModule} from "../sitemap/sitemap.module";
import {LocalModule} from "../ext-local-store/src/LocalModule";

@Module({
    modules:[CQRSModule,PageModule,ClassifyModule,ArticleModule,SiteMapModule],
    components:[CqrsResolver,CqrsService,PageRepository,...CommandHandlers,...EventHandlers,PageSagas],
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
