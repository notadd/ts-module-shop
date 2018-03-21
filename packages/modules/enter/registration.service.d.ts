import { Repository } from "typeorm";
import { BlockEntity } from "../entity/block.entity";
import { SiteEntity } from "../entity/site.entity";
import { VisitEntity } from "../entity/visit.entity";
import { PagerService, ReturnPage } from "../export/common.paging";
export declare class RegistrationService {
    private readonly blockRespository;
    private readonly siteRespository;
    private readonly visitRespository;
    private readonly pageService;
    constructor(blockRespository: Repository<BlockEntity>, siteRespository: Repository<SiteEntity>, visitRespository: Repository<VisitEntity>, pageService: PagerService);
    createBlock(block: BlockEntity): Promise<{
        MessageCodeError: string;
        Code: number;
    }>;
    createSite(site: SiteEntity): Promise<{
        MessageCodeError: string;
        Code: number;
    }>;
    createVisit(visit: VisitEntity): Promise<{
        MessageCodeError: string;
        Code: number;
    }>;
    getAllBlocks(limit?: number, pages?: number): Promise<{
        blocks: BlockEntity[];
        totals: number;
    }>;
    getSite(limit?: number, pages?: number): Promise<{
        sites: SiteEntity[];
        totals: number;
    }>;
    getVisit(limit?: number, pages?: number): Promise<{
        visits: VisitEntity[];
        totals: number;
    }>;
    pagingMethod(totalItems?: number, limit?: number, page?: number): Promise<ReturnPage>;
}
