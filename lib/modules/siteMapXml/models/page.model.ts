import {AggregateRoot} from "@nestjs/cqrs";
import {PageDeletedEvent} from "../events/impl/page-deleted.event";
import {PageCreateEvent} from "../events/impl/page-create.event";
import {PageCurdEvent} from "../events/impl/page-curd.event";
import {PageEntity} from "../../entity/page.entity";
import {CreatePageVm} from "./view/create-page.vm";
import {ClassifyCurdVm} from "./view/classify-curd.vm";
import {ClassifyCurdEvents} from "../events/impl/classify-curd.events";
import {ArticleCurdVm} from "./view/article-curd.vm";
import {ArticleCurdEvents} from "../events/impl/article-curd.events";
const clc=require('cli-color');
export class Page extends AggregateRoot{
    constructor(private readonly id:string){super();}
    //生成xml文件
    addItem(itemId: string) {
        // logic
         console.log(clc.greenBright('添加页面...'));
         //this.apply(new PageCreateEvent(itemId));
    }
    //页面
    createPage(data:CreatePageVm){
        console.log(clc.greenBright('页面增删改...'));
        this.apply(new PageCurdEvent(data));
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
    }
}