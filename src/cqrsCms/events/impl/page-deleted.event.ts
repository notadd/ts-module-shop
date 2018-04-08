import {IEvent} from "@nestjs/cqrs";

export class PageDeletedEvent implements  IEvent{
    constructor(
        public  readonly pageId:string,
    ){}
}