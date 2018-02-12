import {SitemapCreateEvent} from "../impl/sitemap-create.event";
import {SitemapService} from "../../../sitemap/sitemap.service";
import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

const clc=require('cli-color');
@EventsHandler(SitemapCreateEvent)
export class SitemapCreateHandler implements IEventHandler<SitemapCreateEvent>{
    constructor(readonly sitemapService:SitemapService){}
    async handle(event:SitemapCreateEvent){
        let url:string='www.baidu.com';
        console.log('handler event='+JSON.stringify(event));
        let array_baidu_sitemap_options ={
            lc_XML_FileName:event.lc_XML_FileName,
            lc_is_Enabled_XML_Sitemap:event.lc_is_Enabled_XML_Sitemap,
            lc_is_update_sitemap_when_post:event.lc_is_update_sitemap_when_post,
            lc_post_limit1000:event.lc_post_limit1000,
            lc_page_select:event.lc_page_select,
            lc_post_select:event.lc_post_select};
        this.sitemapService.commitXML(array_baidu_sitemap_options,url);
        console.log(clc.yellowBright('Async create SitemapFoundItemEvent...'));
    }
}
