import { ICommand } from "@nestjs/cqrs";
import { ArticleCurdVm } from "../../models/view/article-curd.vm";
export declare class ArticleParamCommand implements ICommand {
    article: ArticleCurdVm;
    constructor(article: ArticleCurdVm);
}
