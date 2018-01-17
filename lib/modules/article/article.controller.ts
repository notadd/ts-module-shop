import {Controller, Get, HttpStatus, Post, Response} from "@nestjs/common";
import {ApiOperation} from "@nestjs/swagger";
import {ArticleService} from "./article.service";

@Controller()
export class ArticleController{
    constructor(private  readonly articleService:ArticleService){};

    @ApiOperation({title:"find All articles"})
    @Get()
    public getArticleAll(@Response() res){

        return res.status(HttpStatus.OK).send();
    }
}