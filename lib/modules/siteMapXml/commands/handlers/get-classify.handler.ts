import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {GetClassifyParamCommand} from "../impl/get-classify-param.command";
import {ClassifyService} from "../../../classify/classify.service";

const clc=require('cli-color');
@CommandHandler(GetClassifyParamCommand)
export class GetClassifyHandler implements ICommandHandler<GetClassifyParamCommand>{
    constructor(private readonly classifyService: ClassifyService){}
    async execute(command:GetClassifyParamCommand,resolver:(value) => void){
        console.log(clc.greenBright('handlerCommand getClassify Command...'));
        let result;
        console.log('usedFor='+JSON.stringify(command.getClassify.useFor));
        //页面分类无极限
        if(command.getClassify.useFor=='page'){
            result=await this.classifyService.findAllClassifyPage(1);
        }
        //文章分类无极限
        if(command.getClassify.useFor=='art'){
            result=await this.classifyService.findAllClassifyArt(1);
        }
        console.log('command='+JSON.stringify(command));
        resolver(result);
    }
}
