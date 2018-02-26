import {ArticleEntity} from "../../../entity/article.entity";

export class ArticleCurdVm{
    //新增文章
    public createArticle?:ArticleEntity;
    //修改文章
    public updateArticle?:ArticleEntity;
    //放入回收站
    public deleteById?:number[];
    //回收站删除
    public recycleDelete?:number[];
    //回收站还原
    public reductionArticle?:number[];
    //获取所有文章
    public getAllArticles?:boolean;
}