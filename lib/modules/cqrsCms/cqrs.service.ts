import {Component} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {CreateXmlVm} from "./models/view/create-xml-vm";
import {CreateParamCommand} from "./commands/impl/create-param.command";
import {DeleteParamCommand} from "./commands/impl/delete-param.command";
import {PageParamCommand} from "./commands/impl/page-param.command";
import {CreatePageVm} from "./models/view/create-page.vm";
import {GetPageVm} from "./models/view/get-page.vm";
import {GetPageParamCommand} from "./commands/impl/get-page-param.command";
import {ClassifyCurdVm} from "./models/view/classify-curd.vm";
import {ClassifyParamCommand} from "./commands/impl/classify-param.command";
import {ArticleCurdVm} from "./models/view/article-curd.vm";
import {ArticleParamCommand} from "./commands/impl/article-param.command";
import {GetClassifyParamCommand} from "./commands/impl/get-classify-param.command";
import {ClassifyService} from "../classify/classify.service";
import {PageSagas} from "./sagas/page.sagas";
import {ClassifyCurdEvents} from "./events/impl/classify-curd.events";
import {GetArticleParamCommand} from "./commands/impl/get-article-param.command";
import {PageService} from "../page/page.service";

@Component()
export class CqrsService{
    //CommandBus是一个命令流。它将命令委托给相应的处理程序。每个命令都必须有相应的命令处理程序:
    constructor(private readonly commonbus:CommandBus){}
    async createXml(createxmlDto:CreateXmlVm){
        const result= await this.commonbus.execute(new CreateParamCommand(createxmlDto));
        return result;
    }
    async upDateXml(){
        const  result=await this.commonbus.execute(new DeleteParamCommand('10000','10000'));
    }
    /**
     * 页面增删改
     * @param {CreatePageVm} updateDto
     * @returns {Promise<any>}
     */
    async pageCurd(updateDto:CreatePageVm){
       const result=await this.commonbus.execute(new PageParamCommand(updateDto));
       return result;
    }
    /**
     * 获取页面
     * @param {GetPageVm} getPageDto
     * @returns {Promise<any>}
     */
    async getPages(getPageDto:GetPageVm){
        const result=await this.commonbus.execute(new GetPageParamCommand(getPageDto));
        return result;

    }

    /**
     * 分类增删改
     * @param {ClassifyCurdVm} getClassifyDto
     * @returns {Promise<any>}
     */
    async classifyCurd(getClassifyDto:ClassifyCurdVm){
        const result=await this.commonbus.execute(new ClassifyParamCommand(getClassifyDto));
        console.log('service='+JSON.stringify(result));
        return result;

    }
    //获取分类
    async getClassify(getClassifyDto:ClassifyCurdVm){
        const result=await this.commonbus.execute(new GetClassifyParamCommand(getClassifyDto));
        return result;
    }
    /**
     * 文章增删改查
     * @param {ArticleCurdVm} getArticleDto
     * @returns {Promise<void>}
     */
    async articleCurd(getArticleDto:ArticleCurdVm){
        const result=await this.commonbus.execute(new ArticleParamCommand(getArticleDto));
        return result;
    }

}