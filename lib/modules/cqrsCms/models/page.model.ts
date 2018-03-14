import {AggregateRoot} from "@nestjs/cqrs";
import {PageCurdEvent} from "../events/impl/page-curd.event";
import {CreatePageVm} from "./view/create-page.vm";
import {ClassifyCurdVm} from "./view/classify-curd.vm";
import {ClassifyCurdEvents} from "../events/impl/classify-curd.events";
import {ArticleCurdVm} from "./view/article-curd.vm";
import {ArticleCurdEvents} from "../events/impl/article-curd.events";
import {SitemapUpdateEvent} from "../events/impl/sitemap-update.event";
const clc=require('cli-color');
export class Page extends AggregateRoot{
    constructor(private readonly id:string){super();}
    //页面
    createPage(data:CreatePageVm){
        console.log(clc.greenBright('页面增删改...'));
        this.apply(new PageCurdEvent(data));
        this.apply(new SitemapUpdateEvent('0'));
    }
    //分类
    createClassify(data:ClassifyCurdVm){
        console.log(clc.greenBright('分类增删改移动...'));
        this.apply(new ClassifyCurdEvents(data))
    }
    //文章
    createArticle(data:ArticleCurdVm){
        console.log(clc.greenBright('文章增删改'));
        this.apply(new ArticleCurdEvents(data));
        this.apply(new SitemapUpdateEvent('0'));
    }
}