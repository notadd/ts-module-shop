import {Component} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {CreateParamDto} from "./interfaces/createParamDto";
import {CreateParamCommand} from "./commands/impl/create-param.command";
import {DeleteParamCommand} from "./commands/impl/delete-param.command";
import {PageParamCommand} from "./commands/impl/page-param.command";


@Component()
export class SitemapXMLService{
    //CommandBus是一个命令流。它将命令委托给相应的处理程序。每个命令都必须有相应的命令处理程序:
    constructor(private readonly commonbus:CommandBus,
    ){}
    async createXml(createDto:CreateParamDto){
        const result= await this.commonbus.execute(new CreateParamCommand(createDto.lc_is_Enabled_XML_Sitemap,createDto.lc_is_update_sitemap_when_post,
            createDto.lc_page_select,createDto.lc_post_limit1000,createDto.lc_XML_FileName,createDto.lc_is_Enabled_XML_Sitemap));
        return result;
    }
    async upDateXml(){
        const  result=await this.commonbus.execute(new DeleteParamCommand('10000','10000'));
    }

    /**
     * 根据id获取页面
     * @returns {Promise<any>}
     */
    async getAllPage(id:number){
        const result=await this.commonbus.execute(new PageParamCommand(id)).then(a=>{console.log('service='+JSON.stringify(a));return a;});
        return result;
    }
}