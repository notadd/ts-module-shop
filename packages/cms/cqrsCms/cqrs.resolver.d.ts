import { ArticleEntity } from "../entity/article.entity";
import { ClassifyService } from "./service/classify.service";
import { CreateXmlVm } from "./models/view/create-xml-vm";
import { CqrsService } from "./cqrs.service";
import { PagerService } from "../export/common.paging";
export declare class CqrsResolver {
    private readonly classifyService;
    private readonly sitemapService;
    private readonly pagerService;
    constructor(classifyService: ClassifyService, sitemapService: CqrsService, pagerService: PagerService);
    createFile(obj: any, arg: any): Promise<any>;
    updateFile(obj: any, arg: any): Promise<CreateXmlVm>;
    getArticlesLimit(obj: any, arg: any): Promise<{
        pagination: {
            totalItems: number;
            currentPage: number;
            pageSize: number;
            totalPages: number;
            startPage: number;
            endPage: number;
            startIndex: number;
            endIndex: number;
            pages: any;
        };
        articles: ArticleEntity[];
    }>;
    getArticlesNoLimit(obj: any, arg: any): Promise<ArticleEntity[]>;
    getClassifys(obj: any, arg: any): any;
    getClassifyById(obj: any, arg: any): Promise<any>;
    getPagesLimit(obj: any, arg: any): Promise<{
        pagination: {
            totalItems: number;
            currentPage: number;
            pageSize: number;
            totalPages: number;
            startPage: number;
            endPage: number;
            startIndex: number;
            endIndex: number;
            pages: any;
        };
        pages: any;
    }>;
    getPageById(obj: any, arg: any): Promise<any>;
    ArticleCU(obj: any, arg: any): Promise<string>;
    ClassifyCU(obj: any, arg: any): Promise<string>;
    PageCUD(obj: any, arg: any): Promise<string>;
    objToStrMap(obj: any): Map<string, string>;
}
