import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {PageRepository} from "../../repository/pageRepository";
import {ArticleParamCommand} from "../impl/article-param.command";
import {ArticleService} from "../../../article/article.service";
import {ClassifyService} from "../../../classify/classify.service";
import {isBoolean} from "util";

const clc=require('cli-color');
@CommandHandler(ArticleParamCommand)
export class ArticleCurdHandler implements ICommandHandler<ArticleParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher,
                private readonly articleService: ArticleService,
                private readonly classifyService:ClassifyService){}

    async execute(command:ArticleParamCommand,resolver:(value) => void):Promise<any>{
        console.log(clc.greenBright('handlerCommand article_curd Command...'));
        let id:string='0';
        const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
        //分类增删改查
        let result;
        if(!command.article.getAllArticles){
            //增加、修改、删除、移动分类
            page.createArticle(command.article);
            //分页获取全部文章
            result=await this.articleService.getArticleAll(command.article.limitNum,command.article.hidden,command.article.pages);
            console.log('command='+JSON.stringify(command));
        }
        //分页获取全部文章：可以选择是否隐藏
        if(command.article.getAllArticles && command.article.getArticles.getArticleAll){
            result=await this.articleService.getArticleAll(command.article.limitNum,command.article.getArticles.getArticleAll,command.article.pages);
        }
        //根据id获取单独页面
        if(command.article.getAllArticles && command.article.getArticles.getArticleById){
            result=await this.articleService.getArticleById(command.article.getArticles.getArticleById)
        }
        //关键字搜索文章
        if(command.article.getAllArticles && command.article.getArticles.keywordsSerach){
            result=await this.articleService.serachArticles(command.article.getArticles.keywordsSerach,command.article.limitNum,command.article.pages);
        }
        //回收站获取文章
        if(command.article.getAllArticles && command.article.getArticles.recycleFind){
            result=await this.articleService.recycleFind(command.article.limitNum,command.article.pages);
        }
        //回收站内根据分类id获取文章
        if(command.article.getAllArticles && command.article.getArticles.reductionGetByClassifyId){
            result=await this.articleService.reductionClassity(command.article.getArticles.reductionGetByClassifyId,
                command.article.limitNum,command.article.pages);
        }
        //页面内根据分类id获取文章，可以选择是否包含置顶文章
        if(command.article.getAllArticles && command.article.getArticles.getArticleByClassifyId){
            result=await this.classifyService.getArticelsByClassifyId(command.article.getArticles.getArticleByClassifyId,command.article.limitNum,
                false,command.article.pages);
        }
        //获取置顶文章
        if(command.article.getAllArticles && command.article.getArticles.findTopPlace){
            result=await this.articleService.findTopPlace(command.article.limitNum,command.article.pages);
        }
        //显示子级分类文章
        if(command.article.getAllArticles && command.article.getArticles.showNext){
            result=await this.classifyService.showNextTitle(command.article.getArticles.showNext);
        }
        //显示上级分类文章以及置顶到上级的文章
        if(command.article.getAllArticles && command.article.getArticles.superiorArticle){
            result=await this.classifyService.showBeforeTitle(command.article.getArticles.superiorArticle);
        }
        //显示当前分类文章
        if(command.article.getAllArticles && command.article.getArticles.getCurrentClassifyArticles){
            result=await this.classifyService.showCurrentArticles(command.article.getArticles.getCurrentClassifyArticles);
        }
        //显示分类层级 暂未确定是否开放
      /*  if(command.article.getAllArticles && command.article.getArticles.getLevelByClassifyId){
            result=await this.articleService.getLevelByClassifyId(command.article.getArticles.getLevelByClassifyId);
        }*/
        page.commit();
        resolver(result);
    }
}
