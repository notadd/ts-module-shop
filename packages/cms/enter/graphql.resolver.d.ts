import { RegistrationService } from "./registration.service";
import { BlockEntity } from "../entity/block.entity";
import { SiteEntity } from "../entity/site.entity";
import { VisitEntity } from "../entity/visit.entity";
import { PagerService } from "../export/common.paging";
export declare class EnterResolver {
    private readonly registration;
    private readonly pagerService;
    constructor(registration: RegistrationService, pagerService: PagerService);
    getAllVisits(obj: any, arg: any): Promise<{
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
        visits: VisitEntity[];
    }>;
    getAllSites(obj: any, arg: any): Promise<{
        sites: SiteEntity[];
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
    }>;
    getAllBlocks(obj: any, arg: any): Promise<{
        blocks: BlockEntity[];
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
    }>;
    createBlocks(obj: any, arg: any): Promise<string>;
    createSites(obj: any, arg: any): Promise<string>;
    createVisits(obj: any, arg: any): Promise<string>;
}
