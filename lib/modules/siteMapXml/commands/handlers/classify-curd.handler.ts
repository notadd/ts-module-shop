import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {PageRepository} from "../../repository/pageRepository";
import {ClassifyParamCommand} from "../impl/classify-param.command";
import {ClassifyService} from "../../../classify/classify.service";

const clc=require('cli-color');
@CommandHandler(ClassifyParamCommand)
export class ClassifyCurdHandler implements ICommandHandler<ClassifyParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher,){}

    async execute(command:ClassifyParamCommand,resolver:(value?) => void):Promise<any>{
        console.log(clc.greenBright('handlerCommand classify_curd Command...'));
        let id:string='0';
        const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
        if(!command.classify.getAllClassify){
            //增加、修改、删除、移动分类
            page.createClassify(command.classify);
            console.log('command='+JSON.stringify(command));
        }
        page.commit();
        resolver();
    }
}
