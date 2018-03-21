import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {PageService} from "../../service/page.service";
import {PageCurdEvent} from "../impl/page-curd.event";

const clc=require('cli-color');
@EventsHandler(PageCurdEvent)
export class PageCurdHandle implements IEventHandler<PageCurdEvent> {
    constructor(readonly pageService: PageService) {
    }
    async handle(event: PageCurdEvent):Promise<any> {
        console.log(clc.yellowBright('Async create curd page...'));
        let array:number[]=event.pageEntity.array;
        //新增页面
        if(event.pageEntity.page!=null && event.pageEntity.page.id==null){
            this.pageService.createPages(event.pageEntity.page,event.pageEntity.content);
        }
        //修改页面
        if(event.pageEntity.page!=null && event.pageEntity.page.id>=1){
            this.pageService.updatePages(event.pageEntity.page,event.pageEntity.content);
        }
        //删除页面
        if(event.pageEntity.page ==null && array.length>=1){
            this.pageService.deletePages(array);
        }
    }
}