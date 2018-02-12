import {AggregateRoot} from "@nestjs/cqrs";
import {PageDeletedEvent} from "../events/impl/page-deleted.event";
import {PageCreateEvent} from "../events/impl/page-create.event";
import {PageCurdEvent} from "../events/impl/page-curd.event";
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
         return this.apply(new PageCreateEvent(itemId));
    }
    findOneById(id:number){
        console.log(clc.greenBright('获取页面...'));
        return this.apply(new PageCurdEvent(id));
    }
}