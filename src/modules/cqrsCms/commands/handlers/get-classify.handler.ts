import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {GetClassifyParamCommand} from "../impl/get-classify-param.command";
import {ClassifyService} from "../../service/classify.service";

@CommandHandler(GetClassifyParamCommand)
export class GetClassifyHandler implements ICommandHandler<GetClassifyParamCommand>{
    constructor(private readonly classifyService: ClassifyService){}
    async execute(command:GetClassifyParamCommand,resolver:(value) => void){
        let result;
        //页面分类无极限
        if(command.getClassify.useFor=='page'){
            result=await this.classifyService.findAllClassifyPage(1);
        }
        //文章分类无极限
        if(command.getClassify.useFor=='art'){
            result=await this.classifyService.findAllClassifyArt(1);
        }
        if(command.getClassify.getClassifyById){
            result=await this.classifyService.findClassifyById(command.getClassify.getClassifyById.useFor,command.getClassify.getClassifyById.id).then(a=>{return a});
        }
        resolver(result);
    }
}
