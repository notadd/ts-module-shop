import{ArticleCurdEvents} from "../impl/article-curd.events";
import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {ArticleService} from "../../../article/article.service";

const clc=require('cli-color');
@EventsHandler(ArticleCurdEvents)
export class TestCurdHandler implements IEventHandler<ArticleCurdEvents>{
    constructor(private readonly articleService:ArticleService){}
    async handle(event:ArticleCurdEvents){
        console.log(clc.yellowBright('Async create Test  article...'));
        const result=await this.articleService.getArticleAll(event.article.limitNum,event.article.hidden,event.article.pages);
      /*  if(event.article.createArticle){
            //新增文章
            await this.articleService.createArticle(event.article.createArticle);
        }
        if(event.article.updateArticle){
            console.log('Test===='+JSON.stringify(event.article));
            //修改文章
            await this.articleService.updateArticle(event.article.updateArticle);
            console.log('TestTime='+new Date());
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
        }*/
    }
}
