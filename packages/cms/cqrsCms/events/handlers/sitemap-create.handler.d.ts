import { SitemapCreateEvent } from "../impl/sitemap-create.event";
import { SitemapService } from "../../../sitemap/sitemap.service";
import { IEventHandler } from "@nestjs/cqrs";
export declare class SitemapCreateHandler implements IEventHandler<SitemapCreateEvent> {
    readonly sitemapService: SitemapService;
    constructor(sitemapService: SitemapService);
    handle(event: SitemapCreateEvent): Promise<void>;
}
