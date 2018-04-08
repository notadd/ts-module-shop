import { IEvent } from "@nestjs/cqrs";
export declare class PageDeletedEvent implements IEvent {
    readonly pageId: string;
    constructor(pageId: string);
}
