import { IEvent } from "@nestjs/cqrs";
import { PageEntity } from "../../../entity/page.entity";
import { PageContentEntity } from "../../../entity/page.content.entity";
export declare class PageCreateEvent implements IEvent {
    page: PageEntity;
    content: PageContentEntity[];
    constructor(page: PageEntity, content: PageContentEntity[]);
}
