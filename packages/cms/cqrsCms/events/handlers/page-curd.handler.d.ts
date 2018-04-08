import { IEventHandler } from "@nestjs/cqrs";
import { PageService } from "../../service/page.service";
import { PageCurdEvent } from "../impl/page-curd.event";
export declare class PageCurdHandle implements IEventHandler<PageCurdEvent> {
    readonly pageService: PageService;
    constructor(pageService: PageService);
    handle(event: PageCurdEvent): Promise<any>;
}
