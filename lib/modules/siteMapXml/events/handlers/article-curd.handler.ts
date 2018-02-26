import{ArticleCurdEvents} from "../impl/article-curd.events";
import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {ArticleService} from "../../../article/article.service";

const clc=require('cli-color');
@EventsHandler(ArticleCurdEvents)
export class ArticleCurdEvent implements IEventHandler<ArticleCurdEvents>{
    constructor(private readonly articleService:ArticleService){}
    async handle(event:ArticleCurdEvents){
        console.log(clc.yellowBright('Async create article...'));
        if(event.article.createArticle){
            //新增文章
            await this.articleService.createArticle(event.article.createArticle);
        }
        if(event.article.updateArticle){
            //修改文章
            await this.articleService.updateArticle(event.article.updateArticle);
        }
        if(event.article.deleteById){
            //放入回收站
            let array:number[]=event.article.deleteById;
            await this.articleService.deleteArticles(array);
        }
        if(event.article.recycleDelete){
            //回收站删除
            await this.articleService.recycleDelete(event.article.recycleDelete);
        }
        if(event.article.reductionArticle){
            //回收站还原
            await this.articleService.reductionArticle(event.article.reductionArticle);
        }
    }
}