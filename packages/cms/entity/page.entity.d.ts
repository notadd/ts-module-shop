import { PageContentEntity } from "./page.content.entity";
import { PageClassifyEntity } from "./pageClassify.entity";
export declare class PageEntity {
    id: number;
    title: string;
    alias: string;
    classifyId: number;
    classify: string;
    createAt: Date;
    updateAt: Date;
    check: boolean;
    contents: PageContentEntity[];
    classifications: PageClassifyEntity[];
}
