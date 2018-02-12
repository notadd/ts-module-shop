import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {CreateParamCommand} from "../impl/create-param.command";
import {PageRepository} from "../../repository/pageRepository";
import {PageParamCommand} from "../impl/page-param.command";

const clc=require('cli-color');
@CommandHandler(PageParamCommand)
export class CreatePageHandler implements ICommandHandler<PageParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher){}

                async execute(command:PageParamCommand,resolver:(value?) => void){
                console.log(clc.greenBright('handlerCommand  PageFindByIdCommand...'));
               // const id=command;
                let id:string='0';
                const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
                const result=page.findOneById(command.id);
                console.log('result='+JSON.stringify(result));
                page.commit();
                resolver(result);
    }
}
