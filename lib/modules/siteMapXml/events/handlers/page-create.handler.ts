import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {PageCreateEvent} from "../impl/page-create.event";
import {PageService} from "../../../page/page.service";
import {PageEntity} from "../../../entity/page.entity";
import {SitemapService} from "../../../sitemap/sitemap.service";

const clc=require('cli-color');
@EventsHandler(PageCreateEvent)
export class PageCreateHandler implements IEventHandler<PageCreateEvent>{
    constructor(readonly sitemapService:SitemapService){}
    async handle(event:PageCreateEvent){
        let url:string='www.baidu.com/graphiql';
        this.sitemapService.UpdateXMLFile(0,url);
        console.log(clc.yellowBright('Async create HeroFoundItemEvent...'));
        return 'hehe';
    }
}