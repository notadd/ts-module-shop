import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {PageRepository} from "../../repository/pageRepository";
import {ClassifyParamCommand} from "../impl/classify-param.command";
import {ClassifyService} from "../../../classify/classify.service";

const clc=require('cli-color');
@CommandHandler(ClassifyParamCommand)
export class ClassifyCurdHandler implements ICommandHandler<ClassifyParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher,
                readonly classifyService: ClassifyService){}

    async execute(command:ClassifyParamCommand,resolver:(value) => void){
        console.log(clc.greenBright('handlerCommand classify Command...'));
        let id:string='0';
        const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
        //分类增删改查
        page.createClassify(command.classify);
        console.log('command='+JSON.stringify(command));
        let result;
        //页面分类无极限
        if(command.classify.useFor=='page'){
            result=await this.classifyService.findAllClassifyPage(1);
        }
        //文章分类无极限
        if(command.classify.useFor=='art'){
            result=await this.classifyService.findAllClassifyArt(1);
        }
        console.log('result='+JSON.stringify(result));
        page.commit();
        resolver(result);
    }
}
