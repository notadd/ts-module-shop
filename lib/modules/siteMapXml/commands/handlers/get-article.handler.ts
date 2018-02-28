import {GetArticleParamCommand} from "../impl/get-article-param.command";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ArticleService} from "../../../article/article.service";
import {ArticleParamCommand} from "../impl/article-param.command";
import {PageParamCommand} from "../impl/page-param.command";
import {PageService} from "../../../page/page.service";
import {GetPageParamCommand} from "../impl/get-page-param.command";

const clc=require('cli-color');
@CommandHandler(GetPageParamCommand)
export class GetArticleHandler implements ICommandHandler<GetPageParamCommand>{
    constructor(private readonly articleService: ArticleService,
                private readonly pageService:PageService){}
    async execute(command:GetPageParamCommand,resolver:(value) => void){
        console.log(clc.greenBright('handlerCommand getArticle Command...'));
        //let result=await this.articleService.getArticleAll(command.getArticleParam.limitNum,command.getArticleParam.hidden,command.getArticleParam.pages);
        let result=await this.pageService.getAllPage(command.getPage.limit,command.getPage.pages);
        console.log('command='+JSON.stringify(command));
        resolver(result);
    }
}
