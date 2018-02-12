import {IEvent} from "@nestjs/cqrs";

export class PageCreateEvent implements IEvent{
    constructor(
        public readonly pageId:string
    ){}
}