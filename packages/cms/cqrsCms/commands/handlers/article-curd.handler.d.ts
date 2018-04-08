import { EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { PageRepository } from "../../repository/pageRepository";
import { ArticleParamCommand } from "../impl/article-param.command";
import { ArticleService } from "../../service/article.service";
import { ClassifyService } from "../../service/classify.service";
export declare class ArticleCurdHandler implements ICommandHandler<ArticleParamCommand> {
    private readonly repositoty;
    private readonly publisher;
    private readonly articleService;
    private readonly classifyService;
    constructor(repositoty: PageRepository, publisher: EventPublisher, articleService: ArticleService, classifyService: ClassifyService);
    execute(command: ArticleParamCommand, resolver: (value) => void): Promise<any>;
}
