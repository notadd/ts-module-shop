import { Repository } from "typeorm";
import { ClassifyEntity } from "../../entity/classify.entity";
import { ArticleEntity } from "../../entity/article.entity";
import { PageClassifyEntity } from "../../entity/pageClassify.entity";
import { PageEntity } from "../../entity/page.entity";
export declare class ClassifyService {
    private readonly repository;
    private readonly artRepository;
    private readonly pageRepository;
    private readonly repositoryPage;
    constructor(repository: Repository<ClassifyEntity>, artRepository: Repository<ArticleEntity>, pageRepository: Repository<PageClassifyEntity>, repositoryPage: Repository<PageEntity>);
    createClassifyArt(entity: ClassifyEntity, limit?: number): Promise<ClassifyEntity[]>;
    createClassifyPage(entity: PageClassifyEntity, limit?: number): Promise<PageClassifyEntity[]>;
    updateClassifyArt(entity: ClassifyEntity, id?: number): Promise<ClassifyEntity[]>;
    updateClassifyPage(entity: PageClassifyEntity, id?: number): Promise<PageClassifyEntity[]>;
    findAllClassifyArt(id: number): Promise<ClassifyEntity[]>;
    findAllClassifyPage(id: number): Promise<PageClassifyEntity[]>;
    Pagerecursion(id: number, listFirst: PageClassifyEntity[]): Promise<PageClassifyEntity[]>;
    Artrecursion(id: number, listFirst: ClassifyEntity[]): Promise<ClassifyEntity[]>;
    deleteClassifyArt(id: number, result: ClassifyEntity[]): Promise<number[]>;
    deleteMethodFirst(id: number): Promise<ClassifyEntity[]>;
    deleteMethodSecond(id: number): Promise<PageClassifyEntity[]>;
    deleteClassifyPage(id: number, result: PageClassifyEntity[]): Promise<number[]>;
    updateArticleClassify(classifyArray: number[], useFor: string): Promise<void>;
    findOneByIdArt(id: number): Promise<ClassifyEntity>;
    findOneByIdPage(id: number): Promise<PageClassifyEntity>;
    showNextTitle(id: number): Promise<ArticleEntity[]>;
    showBeforeTitle(id: number): Promise<ArticleEntity[]>;
    showCurrentArticles(id: number): Promise<ArticleEntity[]>;
    getArticelsByClassifyId(id: number, limit?: number, show?: Boolean, pages?: number, name?: string): Promise<{
        articles: ArticleEntity[];
        totalItems: number;
    }>;
    Fenji(art: ArticleEntity[], limit?: number, pages?: number): Promise<ArticleEntity[]>;
    getClassifyIdForArt(): Promise<number[]>;
    getClassifyId(id: number): Promise<number[]>;
    getClassifyIdPage(id: number): Promise<number[]>;
    findLevel(id: number): Promise<number>;
    showClassifyLevel(arr: ClassifyEntity[], id: number, level: number): Promise<ClassifyEntity[]>;
    interfaceChange(level?: number): string;
    mobileClassifyArt(id: number, groupId: number): Promise<ClassifyEntity[]>;
    resetTheSetTop(arr: number[]): Promise<void>;
    mobileClassifyPage(id: number, groupId: number): Promise<PageClassifyEntity[]>;
    findOnePageClassifyById(id: number): Promise<PageClassifyEntity>;
    findTheDefaultByAlias(Alias: string, useFor: string): Promise<number>;
    classifyTopPlace(id: number, display?: number[]): Promise<number>;
    findClassifyById(useFor: string, id: number): Promise<{
        classifyEntity: any;
        MessageCodeError: any;
    }>;
    TimestampArt(art: ArticleEntity[]): Promise<ArticleEntity[]>;
    classifyCheck(useFor: string, id?: number, groupId?: number, alias?: string, deleteNum?: number): Promise<{
        MessageCodeError: any;
        Continue: boolean;
    }>;
}
