export declare enum EnvConfig {
    global = 0,
    current = 1,
    level1 = 2,
    level2 = 3,
    level3 = 4,
}
export declare class GetLimit {
    readonly limitNumber: any;
    readonly hidden: any;
    readonly pages: any;
}
export declare class GetClassifyLimit {
    readonly id: any;
    readonly limitNumber: any;
    readonly pages: any;
}
export declare class GetLimitNum {
    readonly limitNumber: any;
    readonly pages: any;
}
export declare class KeyWords {
    readonly limitNumber: any;
    readonly keyWords: any;
    readonly pages: any;
}
export declare class DeleteArticleId {
    readonly id: any;
    readonly limitNumber: any;
    readonly pages: any;
}
export declare class CreateArticle {
    readonly name: any;
    readonly content: any;
    readonly classifyId: any;
    readonly classifyName: any;
    readonly abstractArticle: any;
    topPlace: EnvConfig;
    readonly hidden: any;
    readonly publishedTime: any;
    readonly source: any;
    readonly sourceUrl: any;
}
export declare class UpdateArticle {
    readonly id: any;
    readonly name: any;
    readonly classifyId: any;
    readonly classifyName: any;
    readonly content: any;
    readonly abstractArticle: any;
    topPlace: EnvConfig;
    readonly hidden: any;
    readonly publishedTime: any;
    readonly source: any;
    readonly sourceUrl: any;
}
export declare class GetClassify {
    readonly usedFor: any;
    readonly id: any;
}
export declare class CreateClassify {
    readonly usedFor: any;
    readonly classifyName: any;
    readonly classifyAlias: any;
    readonly chainUrl: any;
    readonly describe: any;
    readonly color: any;
    readonly parentId: any;
}
export declare class UpdateClassify {
    readonly usedFor: any;
    readonly id: any;
    readonly classifyName: any;
    readonly classifyAlias: any;
    readonly chainUrl: any;
    readonly describe: any;
    readonly color: any;
    readonly parentId: any;
}
export declare class DeleteDto {
    readonly usedFor: any;
    readonly id: any;
}
export declare class showNextDto {
    readonly id: any;
}
export declare class PageSerach {
    readonly keyWords: any;
    readonly limitNum: any;
    readonly pages: any;
}
export declare class MobileClassify {
    readonly usedFor: any;
    readonly id: any;
    readonly parentId: any;
}
export declare class CreatePage {
    readonly title: any;
    readonly alias: any;
    readonly content: any;
    readonly open: any;
    readonly classify: any;
    readonly limitNum: any;
    readonly pages: any;
}
export declare class ContentMap {
    readonly id: any;
    readonly content: any;
}
export declare class UpdatePage {
    readonly id: any;
    readonly title: any;
    readonly alias: any;
    readonly classify: any;
    readonly contents: [ContentMap];
}
