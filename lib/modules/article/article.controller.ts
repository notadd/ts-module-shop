import {Body, Controller, Get, HttpStatus, Post, Response} from "@nestjs/common";
import {ApiOperation} from "@nestjs/swagger";
import {ArticleService} from "./article.service";
import {GetLimit} from "../common/param.dto";
import {KeyWords} from "../common/param.dto";

@Controller()
export class ArticleController{
    constructor(private  readonly articleService:ArticleService){};

    @ApiOperation({title:"find All articles"})
    @Post('findAll')
    public getArticleAll(@Response() res,@Body() limitNum:GetLimit){
        const findAll=this.articleService.getArticleAll(limitNum.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(findAll));
    }

    @ApiOperation({title:"Keyword search"})
    @Post('serach')
    public keywordsSerach(@Response() res,@Body() key:KeyWords){
        const findAll=this.articleService.serachArticles(key.keyWords,key.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(findAll));
    }
}