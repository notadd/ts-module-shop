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
    killEnemy(enemyId: string) {
        // logic
        console.log(clc.greenBright('删除页面...'));
         this.apply(new PageDeletedEvent(enemyId));
    }

    addItem(itemId: string) {
        // logic
         console.log(clc.greenBright('添加页面...'));
         //this.apply(new PageCreateEvent(itemId));
    }
    findOneById(id:number){
        console.log(clc.greenBright('获取页面...'));
        //this.apply(new PageCurdEvent(id));
    }
    createPage(data:CreatePageVm){
        console.log(clc.greenBright('页面增删改...'));
        this.apply(new PageCurdEvent(data.page,data.content,data.array));
    }
    createClassify(data:ClassifyCurdVm){
        console.log(clc.greenBright('分类增删改移动...'));
        this.apply(new ClassifyCurdEvents(data))
    }
    createArticle(data:ArticleCurdVm){
        console.log(clc.greenBright('文章增删改'));
        this.apply(new ArticleCurdEvents(data));
    }
}