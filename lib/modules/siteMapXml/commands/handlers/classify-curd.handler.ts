import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {PageRepository} from "../../repository/pageRepository";
import {ClassifyParamCommand} from "../impl/classify-param.command";
import {ClassifyService} from "../../../classify/classify.service";

const clc=require('cli-color');
@CommandHandler(ClassifyParamCommand)
export class ClassifyCurdHandler implements ICommandHandler<ClassifyParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher,
                readonly classifyService: ClassifyService){console.log('start')}

    async execute(command:ClassifyParamCommand,resolver:(value) => void):Promise<any>{
        console.log(clc.greenBright('handlerCommand classify_curd Command...'));
        let id:string='0';
        const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
        //分类增删改查
        let result;
        if(!command.classify.getAllClassify){
            //增加、修改、删除、移动分类
            page.createClassify(command.classify);
            console.log('command='+JSON.stringify(command));
        }
        //页面分类无极限
        if(command.classify.useFor=='page'){
            result=await this.classifyService.findAllClassifyPage(1);
        }
        //文章分类无极限
        if(command.classify.useFor=='art'){
            result=await this.classifyService.findAllClassifyArt(1);
        }
        page.commit();
        resolver(result);
    }
}
