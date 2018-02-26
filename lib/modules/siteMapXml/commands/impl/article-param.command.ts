import {ICommand} from "@nestjs/cqrs";
import {ArticleCurdVm} from "../../models/view/article-curd.vm";

export class ArticleParamCommand implements ICommand{
    constructor(public article:ArticleCurdVm){}
}