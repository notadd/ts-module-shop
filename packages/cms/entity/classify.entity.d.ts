import { ArticleEntity } from "./article.entity";
export declare class ClassifyEntity {
    id: number;
    title: string;
    classifyAlias: string;
    chainUrl: string;
    describe: string;
    color: string;
    groupId: number;
    level: number;
    isCurrentType: boolean;
    isChildType: boolean;
    isAllTop: boolean;
    isPreTop: boolean;
    children: ClassifyEntity[];
    parent: ClassifyEntity;
    createAt: Date;
    updateAt: Date;
    articles: ArticleEntity[];
}
