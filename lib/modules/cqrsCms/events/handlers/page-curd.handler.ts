import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {PageService} from "../../../page/page.service";
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
            console.log(clc.greenBright('createPage='+JSON.stringify(event.pageEntity)));
            this.pageService.createPages(event.pageEntity.page,event.pageEntity.content);
        }
        //修改页面
        if(event.pageEntity.page!=null && event.pageEntity.page.id>=1){
            console.log(clc.greenBright('updatePage='+JSON.stringify(event.pageEntity)));
            this.pageService.updatePages(event.pageEntity.page,event.pageEntity.content);
        }
        //删除页面
        if(event.pageEntity.page ==null && array.length>=1){
            console.log('deleteArray='+JSON.stringify(event.pageEntity.array));
            this.pageService.deletePages(array);
        }
    }
}