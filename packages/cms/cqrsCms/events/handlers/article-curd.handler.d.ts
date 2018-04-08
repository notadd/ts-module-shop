import { ArticleCurdEvents } from "../impl/article-curd.events";
import { IEventHandler } from "@nestjs/cqrs";
import { ArticleService } from "../../service/article.service";
export declare class ArticleCurdEvent implements IEventHandler<ArticleCurdEvents> {
    private readonly articleService;
    constructor(articleService: ArticleService);
    handle(event: ArticleCurdEvents): Promise<void>;
}
