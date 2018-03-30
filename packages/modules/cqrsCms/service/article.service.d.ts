import { Repository } from "typeorm";
import { ArticleEntity } from "../../entity/article.entity";
import { ClassifyService } from "./classify.service";
import { ClassifyEntity } from "../../entity/classify.entity";
export declare class ArticleService {
    private readonly respository;
    private readonly claRespository;
    private readonly classifyService;
    private storeService;
    constructor(respository: Repository<ArticleEntity>, claRespository: Repository<ClassifyEntity>, classifyService: ClassifyService, storeService: any);
    getArticleAll(limit?: number, hidden?: boolean, pages?: number): Promise<{
        articles: ArticleEntity[];
        totalItems: number;
    }>;
    searchArticles(name: string, limit?: number, pages?: number): Promise<{
        articles: ArticleEntity[];
        totalItems: number;
    }>;
    deleteArticles(array: number[]): Promise<number>;
    createArticle(article: ArticleEntity): Promise<void>;
    updateArticle(article: ArticleEntity): Promise<void>;
    recycleFind(limit?: number, pages?: number): Promise<{
        articles: ArticleEntity[];
        totalItems: number;
    }>;
    recycleDelete(array: number[]): Promise<any>;
    reductionArticle(array: number[]): Promise<number>;
    findTopPlace(limit?: number, pages?: number): Promise<{
        articles: ArticleEntity[];
        totalItems: number;
    }>;
    reductionClassity(id: number, limit?: number, pages?: number): Promise<{
        articles: ArticleEntity[];
        totalItems: number;
    }>;
    getLevelByClassifyId(id: number): Promise<string>;
    CurdArticleCheck(classifyId?: number, id?: number): Promise<{
        MessageCodeError: string;
        Continue: boolean;
    }>;
    upLoadPicture(req: any, bucketName: string, rawName: string, base64: string, id?: number): Promise<{
        pictureUrl: any;
        bucketName: string;
        pictureName: string;
        type: string;
        MessageCodeError: string;
    } | {
        MessageCodeError: string;
        pictureUrl?: undefined;
        bucketName?: undefined;
        pictureName?: undefined;
        type?: undefined;
    }>;
    objToStrMap(obj: any): Map<string, string>;
    getArticleById(id: number): Promise<{
        articles: ArticleEntity[];
    }>;
}
