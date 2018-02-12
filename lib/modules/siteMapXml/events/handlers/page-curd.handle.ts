import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {PageService} from "../../../page/page.service";
import {PageCurdEvent} from "../impl/page-curd.event";
import {PageEntity} from "../../../entity/page.entity";

const clc=require('cli-color');
@EventsHandler(PageCurdEvent)
export class PageCurdHandle implements IEventHandler<PageCurdEvent> {
    constructor(readonly pageService: PageService) {
    }
    async handle(event: PageCurdEvent) {
        let result:PageEntity=await this.pageService.findPageById(event.id);
        console.log('page='+JSON.stringify(result));
        return result;
    }
}