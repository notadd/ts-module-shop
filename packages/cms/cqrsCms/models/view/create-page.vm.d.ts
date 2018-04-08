import { PageEntity } from "../../../entity/page.entity";
import { PageContentEntity } from "../../../entity/page.content.entity";
export declare class CreatePageVm {
    page?: PageEntity;
    content?: PageContentEntity[];
    limit: number;
    pages: number;
    array?: number[];
}
