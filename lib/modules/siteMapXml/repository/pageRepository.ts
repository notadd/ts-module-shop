import {Page} from "../models/page.model";
import {userPage} from "./fixtures/page";
import {Component} from "@nestjs/common";
import {SitemapService} from "../../sitemap/sitemap.service";

@Component()
export class PageRepository{
    constructor(readonly sitemapService:SitemapService){}
    async find(id:string): Promise<Page>{
        return userPage ;
    }
    async createXml(CreateParamCommand){
        let array_baidu_sitemap_options ={
            lc_XML_FileName:CreateParamCommand.lc_XML_FileName,
            lc_is_Enabled_XML_Sitemap:CreateParamCommand.lc_is_Enabled_XML_Sitemap,
            lc_is_update_sitemap_when_post:CreateParamCommand.lc_is_update_sitemap_when_post,
            lc_post_limit1000:CreateParamCommand.lc_post_limit1000,
            lc_page_select:CreateParamCommand.lc_page_select,
            lc_post_select:CreateParamCommand.lc_post_select};
        let url:string='localhost:3001/graphiql';
        this.sitemapService.commitXML(array_baidu_sitemap_options,url);
    }

}