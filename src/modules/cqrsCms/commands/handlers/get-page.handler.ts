import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PageService} from "../../service/page.service";
import {GetPageParamCommand} from "../impl/get-page-param.command";

@CommandHandler(GetPageParamCommand)
export class GetPageHandler implements ICommandHandler<GetPageParamCommand>{
    constructor(private readonly pageService: PageService){}

    async execute(command:GetPageParamCommand,resolver:(value) => void){
        let result;
        //关键字搜索
        if(command.getPage.keywords){
           result=this.pageService.serachKeywords(command.getPage.keywords,command.getPage.limit,command.getPage.pages);
        }
        //分类id获取页面
        if(command.getPage.classifyId){
            result=this.pageService.findPageByClassifyId(command.getPage.classifyId,command.getPage.limit,command.getPage.pages);
        }
        //根据页面id获取具体内容
        if(command.getPage.id){
            result=this.pageService.findPageById(command.getPage.id);
        }
        //获取所有页面
        if(command.getPage.getAll){
            result=this.pageService.getAllPage(command.getPage.limit,command.getPage.pages);
        }
        resolver(result);
    }
}
