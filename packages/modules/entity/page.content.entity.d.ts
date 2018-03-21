import { PageEntity } from "./page.entity";
export declare class PageContentEntity {
    id: number;
    parentId: number;
    content: string;
    page: PageEntity;
    createAt: Date;
    updateAt: Date;
}
