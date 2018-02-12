import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {SitemapUpdateEvent} from "../impl/sitemap-update.event";
import {SitemapCreateEvent} from "../impl/sitemap-create.event";
import {SitemapService} from "../../../sitemap/sitemap.service";
const clc=require('cli-color');
@EventsHandler(SitemapUpdateEvent)
export  class SitemapUpdateHandler implements IEventHandler<SitemapUpdateEvent>{
    constructor(readonly sitemapService:SitemapService){}
    async handle(event:SitemapUpdateEvent){
        let url:string='www.xml.xml.com';
        this.sitemapService.UpdateXMLFile(0,url);
        console.log(clc.yellowBright('Async update SitemapFoundItemEvent...'));
    }

}