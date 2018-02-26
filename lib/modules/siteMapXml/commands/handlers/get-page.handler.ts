import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {PageService} from "../../../page/page.service";
import {GetPageParamCommand} from "../impl/get-page-param.command";

const clc=require('cli-color');
@CommandHandler(GetPageParamCommand)
export class GetPageHandler implements ICommandHandler<GetPageParamCommand>{
    constructor(private readonly pageService: PageService){}

    async execute(command:GetPageParamCommand,resolver:(value) => void){
        console.log(clc.greenBright('handlerCommand getPage Command...'));
        let result;
        //关键字搜索
        if(command.keywords){
           result=this.pageService.serachKeywords(command.keywords,command.limit,command.pages);
        }
        //分类id获取页面
        if(command.classifyId){
            result=this.pageService.findPageByClassifyId(command.classifyId,command.limit,command.pages);
        }
        //根据页面id获取具体内容
        if(command.id){
            result=this.pageService.findPageById(command.id);
        }
        //获取所有页面
        if(command.getAll){
            result=this.pageService.getAllPage(command.limit,command.pages);
        }
        resolver(result);
    }
}
