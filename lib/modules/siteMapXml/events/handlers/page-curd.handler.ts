import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {PageService} from "../../../page/page.service";
import {PageCurdEvent} from "../impl/page-curd.event";

const clc=require('cli-color');
@EventsHandler(PageCurdEvent)
export class PageCurdHandle implements IEventHandler<PageCurdEvent> {
    constructor(readonly pageService: PageService) {
    }
    async handle(event: PageCurdEvent) {
        console.log('start='+JSON.stringify(event));
        let array:number[]=event.array;
        //新增页面
        if(event.page!=null && event.page.id==null){
            this.pageService.createPages(event.page,event.content);
        }
        //修改页面
        if(event.page!=null && event.page.id>=1){
            console.log(clc.greenBright('updatePage='+JSON.stringify(event.page)));
            this.pageService.updatePages(event.page,event.content);
        }
        //删除页面
        if(event.page ==null && array.length>=1){
            console.log('deleteArray='+JSON.stringify(event.array));
            this.pageService.deletePages(array);
        }

    }
}