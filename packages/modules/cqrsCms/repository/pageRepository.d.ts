import { Page } from "../models/page.model";
import { SitemapService } from "../../sitemap/sitemap.service";
import { Sitemap } from "../models/sitemap.model";
export declare class PageRepository {
    readonly sitemapService: SitemapService;
    constructor(sitemapService: SitemapService);
    find(id: string): Promise<Page>;
    siteMap(): Promise<Sitemap>;
}
