import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {CreateParamCommand} from "../impl/create-param.command";
import {PageRepository} from "../../repository/pageRepository";

const clc=require('cli-color');
@CommandHandler(CreateParamCommand)
export class CreatePageHandler implements ICommandHandler<CreateParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher){}

                async execute(command:CreateParamCommand,resolver:(value?) => void){
                console.log(clc.greenBright('handlerCommand KillDragonCommand...'));
               // const id=command;
                let id:string='0';
                const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
                page.killEnemy(id);
                page.commit();
                resolver();
    }
}