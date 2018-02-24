import {Component} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {CreateParamDto} from "./interfaces/createParamDto";
import {CreateParamCommand} from "./commands/impl/create-param.command";
import {DeleteParamCommand} from "./commands/impl/delete-param.command";
import {PageParamCommand} from "./commands/impl/page-param.command";
import {CreatePageVm} from "./models/view/create-page.vm";
import {GetPageVm} from "./models/view/get-page.vm";
import {GetPageParamCommand} from "./commands/impl/get-page-param.command";


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
       // const result=await this.commonbus.execute(new PageParamCommand(id)).then(a=>{console.log('service='+JSON.stringify(a));return a;});
      //  return result;
    }

    /**
     * 新增页面
     * @param {CreatePageVm} createPageDto
     * @returns {Promise<any>}
     */
    async createPage(createPageDto:CreatePageVm){
        const result=await this.commonbus.execute(new PageParamCommand(createPageDto.page,createPageDto.content,createPageDto.limit,createPageDto.pages));
        return result;
    }

    /**
     * 修改页面
     * @param {CreatePageVm} updateDto
     * @returns {Promise<any>}
     */
    async updatePages(updateDto:CreatePageVm){
        const result=await this.commonbus.execute(new PageParamCommand(updateDto.page,updateDto.content,updateDto.limit,updateDto.pages));
        return result;
    }

    /**
     * 删除页面
     * @param {CreatePageVm} deletePageDto
     * @returns {Promise<any>}
     */
    async deletePages(deletePageDto:CreatePageVm){
        const result=await this.commonbus.execute(new PageParamCommand(deletePageDto.page,deletePageDto.content,deletePageDto.limit,deletePageDto.pages,deletePageDto.array));
        return result;
    }

    /**
     * 获取页面
     * @param {GetPageVm} getPageDto
     * @returns {Promise<any>}
     */
    async getPages(getPageDto:GetPageVm){
        const result=await this.commonbus.execute(new GetPageParamCommand(getPageDto.limit,getPageDto.pages,getPageDto.keywords,getPageDto.classifyId,getPageDto.id,getPageDto.getAll));
        return result;

    }

}