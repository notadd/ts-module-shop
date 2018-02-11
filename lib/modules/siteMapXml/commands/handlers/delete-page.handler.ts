import {PageRepository} from "../../repository/pageRepository";
import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {DeleteParamCommand} from "../impl/delete-param.command";
const clc=require('cli-color');

@CommandHandler(DeleteParamCommand)
export class DeletePageHandler implements ICommandHandler<DeleteParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher){}

    async execute(command:DeleteParamCommand,resolver:(value?)=>void){
        console.log(clc.greenBright('handlerCommand delete KillDragonCommand...'));
        // const id=command;
        const com=command;
        let id:string='0';
        const page=this.publisher.mergeObjectContext(await this.repositoty.find(id));
        const result=page.addItem(id);
        console.log('handler='+JSON.stringify(result));
        page.commit();
        resolver(result);
    }
}