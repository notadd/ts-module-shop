import {IEvent} from "@nestjs/cqrs";
import {PageEntity} from "../../../entity/page.entity";
import {PageContentEntity} from "../../../entity/page.content.entity";
export class PageCreateEvent implements IEvent{
    constructor(
        public  page:PageEntity,
        public content:PageContentEntity[],
    ){}
}