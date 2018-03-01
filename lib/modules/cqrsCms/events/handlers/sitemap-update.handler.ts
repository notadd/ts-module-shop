import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {SitemapUpdateEvent} from "../impl/sitemap-update.event";
import {SitemapCreateEvent} from "../impl/sitemap-create.event";
import {SitemapService} from "../../../sitemap/sitemap.service";
const clc=require('cli-color');
@EventsHandler(SitemapUpdateEvent)
export  class SitemapUpdateHandler implements IEventHandler<SitemapUpdateEvent>{
    constructor(readonly sitemapService:SitemapService){}
    async handle(event:SitemapUpdateEvent){
        console.log(clc.yellowBright('Async update SitemapFoundItemEvent...'));
        let url:string='www.baidu.com';
        const result=await this.sitemapService.findSitemap(1).then(a=>{return a});
        if(result.open){
            this.sitemapService.UpdateXMLFile(0,url);
        }
    }

}