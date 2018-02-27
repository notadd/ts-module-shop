import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {CreateParamCommand} from "../impl/create-param.command";
import {PageRepository} from "../../repository/pageRepository";
import {PageParamCommand} from "../impl/page-param.command";
import {PageEntity} from "../../../entity/page.entity";
import {HttpException} from "@nestjs/common";
import {PageService} from "../../../page/page.service";

const clc=require('cli-color');
@CommandHandler(PageParamCommand)
export class CreatePageHandler implements ICommandHandler<PageParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher,
                readonly pageService: PageService){}

                async execute(command:PageParamCommand,resolver:(value) => void):Promise<any>{
                console.log(clc.greenBright('handlerCommand  PageFindByIdCommand...'));
                let id:string='0';
                const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
                page.createPage(command.pageEntity);
                let result=await this.pageService.getAllPage(command.pageEntity.limit,command.pageEntity.pages);
                page.commit();
                resolver(result);
    }
}
