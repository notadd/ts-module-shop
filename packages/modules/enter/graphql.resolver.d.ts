import { RegistrationService } from "./registration.service";
import { BlockEntity } from "../entity/block.entity";
import { SiteEntity } from "../entity/site.entity";
import { VisitEntity } from "../entity/visit.entity";
export declare class EnterResolver {
    private readonly registration;
    constructor(registration: RegistrationService);
    getAllVisits(obj: any, arg: any): Promise<{
        pagination: void;
        visits: VisitEntity[];
    }>;
    getAllSites(obj: any, arg: any): Promise<{
        sites: SiteEntity[];
        pagination: void;
    }>;
    getAllBlocks(obj: any, arg: any): Promise<{
        blocks: BlockEntity[];
        pagination: void;
    }>;
    createBlocks(obj: any, arg: any): Promise<string>;
    createSites(obj: any, arg: any): Promise<string>;
    createVisits(obj: any, arg: any): Promise<string>;
}
