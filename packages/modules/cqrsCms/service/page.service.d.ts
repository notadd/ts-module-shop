import { Repository } from "typeorm";
import { PageEntity } from "../../entity/page.entity";
import { PageClassifyEntity } from "../../entity/pageClassify.entity";
import { ClassifyService } from "./classify.service";
import { PageContentEntity } from "../../entity/page.content.entity";
export declare class PageService {
    private readonly repository;
    private readonly classifyService;
    private readonly contentRepository;
    private readonly pageRepository;
    constructor(repository: Repository<PageEntity>, classifyService: ClassifyService, contentRepository: Repository<PageContentEntity>, pageRepository: Repository<PageClassifyEntity>);
    getAllPage(limit?: number, page?: number): Promise<{
        pages: PageEntity[];
        totalItems: number;
    }>;
    serachKeywords(keywords: string, limit?: number, page?: number): Promise<{
        pages: PageEntity[];
        totalItems: number;
    }>;
    deletePages(array: number[], limit?: number, page?: number): Promise<void>;
    createPages(page: PageEntity, contents: PageContentEntity[], limit?: number, pages?: number): Promise<void>;
    curdCheck(alias?: string, classifyId?: number): Promise<{
        MessageCodeError: string;
        Continue: boolean;
    }>;
    updatePages(page: PageEntity, content: PageContentEntity[], limit?: number, pages?: number): Promise<void>;
    findPageById(id: number): Promise<PageEntity>;
    findPageByClassifyId(id: number, limit?: number, page?: number): Promise<{
        pages: PageEntity[];
        totalItems: number;
    }>;
    getClassifyId(id: number): Promise<number[]>;
}
