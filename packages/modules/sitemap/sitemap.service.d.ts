import { Repository } from "typeorm";
import { ArticleEntity } from "../entity/article.entity";
import { PageEntity } from "../entity/page.entity";
import { SitemapEntity } from "../entity/sitemap.entity";
export declare class SitemapService {
    private readonly artRepository;
    private readonly pageRepository;
    private readonly siteRepository;
    constructor(artRepository: Repository<ArticleEntity>, pageRepository: Repository<PageEntity>, siteRepository: Repository<SitemapEntity>);
    commitXML(array_baidu_sitemap_options: any, url: string): Promise<void>;
    UpdateXMLFile($mes: number, url: string): Promise<void>;
    getBaiduOptions(getBaiduOptions?: any): Promise<any[]>;
    buildSitemapXml(url: string): Promise<void>;
}
