import { IEvent } from "@nestjs/cqrs";
export declare class SitemapUpdateEvent implements IEvent {
    private id;
    constructor(id: string);
}
