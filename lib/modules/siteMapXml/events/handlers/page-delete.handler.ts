/*
import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {PageDeletedEvent} from "../impl/page-deleted.event";
import {PageService} from "../../../page/page.service";
import {PageEntity} from "../../../entity/page.entity";

const clc=require('cli-color');
@EventsHandler(PageDeletedEvent)
export class PageDeleteHandler implements IEventHandler<PageDeletedEvent>{
    constructor(/!*private pageservice:PageService*!/){}
     handle(event:PageDeletedEvent){
        console.log(clc.yellowBright('Async delete HeroFoundItemEvent...'));

     /!*   let pages:PageEntity[]=await this.pageservice.getAllPage().then(A=>{return A.pages});
        return pages;*!/
    }
}*/
