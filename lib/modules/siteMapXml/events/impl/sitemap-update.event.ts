import {IEvent} from "@nestjs/cqrs";
export class SitemapUpdateEvent implements IEvent{
    constructor(private id:string){}
}
