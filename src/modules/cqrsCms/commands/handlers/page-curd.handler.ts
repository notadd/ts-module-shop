import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {PageRepository} from "../../repository/pageRepository";
import {PageParamCommand} from "../impl/page-param.command";
import {PageService} from "../../service/page.service";

@CommandHandler(PageParamCommand)
export class CreatePageHandler implements ICommandHandler<PageParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher,
                private readonly pageService:PageService){}

                async execute(command:PageParamCommand,resolver:(value?) => void):Promise<any>{
                let id:string='0';
                let result;
                const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
                if(!command.pageEntity.array){
                    result=await this.pageService.curdCheck(command.pageEntity.page.alias,command.pageEntity.page.classifyId);
                    if(result.Continue){page.createPage(command.pageEntity)}
                }else{
                    page.createPage(command.pageEntity);
                }
                page.commit();
                resolver(result);
    }
}
