import {SitemapService} from "./sitemap.service";
import {Post, Response, Body, HttpStatus, Controller,Request} from "@nestjs/common";
/*
import {get_option} from "../common/param.dto";
*/

@Controller()
export class SitemapController{
  /*  constructor(private readonly sitemapService:SitemapService){}
    //暂时不做html地图生成和目录生成
    @Post('commitXML')
    public commitXML(@Response() res,@Request() req,@Body() get:get_option){
        let array_baidu_sitemap_options ={
            lc_XML_FileName:get.lc_XML_FileName,
            lc_is_Enabled_XML_Sitemap:get.lc_is_Enabled_XML_Sitemap,
            lc_is_update_sitemap_when_post:get.lc_is_update_sitemap_when_post,
            lc_post_limit1000:get.lc_post_limit1000,
            lc_page_select:get.lc_page_select,
            lc_post_select:get.lc_post_select};
        let url=JSON.stringify(req.protocol+"://"+req.get('host'));
       const result=this.sitemapService.commitXML(array_baidu_sitemap_options,url);
       return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }
    @Post('updateXML')
    public UpdateXMLFile(@Request() req){
        let url=JSON.stringify(req.protocol+"://"+req.get('host'));
        this.sitemapService.UpdateXMLFile(0,url);
    }*/
}
