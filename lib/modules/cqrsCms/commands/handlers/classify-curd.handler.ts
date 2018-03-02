import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {PageRepository} from "../../repository/pageRepository";
import {ClassifyParamCommand} from "../impl/classify-param.command";
import {ClassifyService} from "../../../classify/classify.service";

const clc=require('cli-color');
@CommandHandler(ClassifyParamCommand)
export class ClassifyCurdHandler implements ICommandHandler<ClassifyParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher,
                private readonly classifyService:ClassifyService){}

    async execute(command:ClassifyParamCommand,resolver:(value?) => void):Promise<any>{
        console.log(clc.greenBright('handlerCommand classify_curd Command...'));
        let id:string='0';
        const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
        let value,MessageCodeError;
        if(!command.classify.getAllClassify){
            //增加、修改、删除、移动分类
            if(command.classify.createClassify || command.classify.updateClassify){
                const result=await this.classifyService.classifyCheck(
                    command.classify.useFor,
                    command.classify.createClassify.id,
                    command.classify.createClassify.groupId,
                    command.classify.createClassify.classifyAlias);
                value=result.Continue;
                MessageCodeError=result.MessageCodeError;
            }
            if(command.classify.updateClassify){
                const result=await this.classifyService.classifyCheck(command.classify.useFor,
                    command.classify.updateClassify.id,
                    command.classify.updateClassify.groupId,
                    command.classify.createClassify.classifyAlias);
                value=result.Continue;
                MessageCodeError=result.MessageCodeError
            }
            if(command.classify.deleteClassify){
                const  result=await this.classifyService.classifyCheck(command.classify.useFor,0,0,'',command.classify.deleteClassify);
                value=result.Continue;
                MessageCodeError=result.MessageCodeError
            }
            if(value==undefined) value=true;
            if(value)page.createClassify(command.classify);
        }
        page.commit();
        resolver({MessageCodeError:MessageCodeError});
    }
}
