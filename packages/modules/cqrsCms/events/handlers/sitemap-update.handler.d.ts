import { IEventHandler } from "@nestjs/cqrs";
import { SitemapUpdateEvent } from "../impl/sitemap-update.event";
import { SitemapService } from "../../../sitemap/sitemap.service";
export declare class SitemapUpdateHandler implements IEventHandler<SitemapUpdateEvent> {
    readonly sitemapService: SitemapService;
    constructor(sitemapService: SitemapService);
    handle(event: SitemapUpdateEvent): Promise<void>;
}
