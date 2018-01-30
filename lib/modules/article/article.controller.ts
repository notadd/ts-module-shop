import {Body, Controller, HttpStatus, Post, Response} from "@nestjs/common";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ArticleService} from "./article.service";
import {EnvConfig, GetLimit, showNextDto} from "../common/param.dto";
import {CreateArticle} from "../common/param.dto";
import {DeleteArticleId} from "../common/param.dto";
import {GetClassifyLimit} from "../common/param.dto";
import {GetLimitNum} from "../common/param.dto";
import {UpdateArticle} from "../common/param.dto";
import {KeyWords} from "../common/param.dto";
import {ArticleEntity} from "../entity/article.entity";

@Controller('article')
export class ArticleController{
    constructor(private  readonly articleService:ArticleService){};

    /**
     * 分页所有所有文章
     * @param res
     * @param {GetLimit} limitNum
     */
    @ApiOperation({title:"find All articles"})
    @ApiResponse({status:500,description:'Internal server error'})
    @Post('findAll')
    public async getArticleAll(@Response() res,@Body() limitNum:GetLimit){
        let findAll:ArticleEntity[]=await this.articleService.getArticleAll(limitNum.limitNumber,limitNum.hidden);
        return res.status(HttpStatus.OK).send(JSON.stringify(findAll));
    }

    /**
     * 关键字分页获取文章
     * @param res
     * @param {KeyWords} key
     */
    @ApiOperation({title:"Keyword search"})
    @ApiResponse({status:500,description:'Internal server error'})
    @Post('serach')
    public async keywordsSerach(@Response() res,@Body() key:KeyWords){
        let findAll:ArticleEntity[]=await this.articleService.serachArticles(key.keyWords,key.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(findAll));
    }

    /**
     * 移出数据到回收站
     * @param res
     * @param {DeleteArticleId} idArray
     */
    @ApiOperation({title:'Delete data according to Id.'})
    @ApiResponse({status:500,description:'Internal server error'})
    @Post('deleteById')
    public async deleteById(@Response() res,@Body() idArray:DeleteArticleId){
        let result:number= await this.articleService.deleteArticles(idArray.id);
        let countNum:string=`已成功将${result}条数据放入回收站`;
      return res.status(HttpStatus.OK).send(JSON.stringify(countNum));
    }

    /**
     * 添加文章
     * @param res
     * @param {CreateArticle} article
     */
    @ApiOperation({title:'Add the article'})
    @ApiResponse({status:403,description:'topPlace 必须为global、current、level1、level2、level3'})
    @ApiResponse({status:500,description:'Internal server error'})
    @Post('createArticle')
    public async createArticle(@Response() res,@Body() article:CreateArticle){
        let topPlace:string=article.topPlace.toString();
        if(topPlace=='global' || topPlace=='current'){}else if(topPlace=='level1' || topPlace=='level2'){}else if(topPlace=='level1'){}else{
            return res.status(403).send()
        }
        let art =new ArticleEntity();
        art.name=article.name;
        art.classifyId=article.classifyId;
        art.classify =article.classifyName;
        art.abstract=article.abstractArticle;
        art.topPlace =topPlace;
        art.hidden =article.hidden;
        art.content = article.content;
        art.publishedTime =new Date(Date.parse(article.publishedTime.replace(/-/g,"/")));
        art.source = article.source;
        art.sourceUrl =article.sourceUrl;
        let result= await this.articleService.createArticle(art);
        let str:string=JSON.stringify(result);
        let final:string=`成功添加数据${str}`;
        return res.status(HttpStatus.OK).send(JSON.stringify(final));
    }

    /**
     * 修改文章
     * @param res
     * @param {UpdateArticle} article
     */
    @ApiOperation({title:'Update the article'})

    @Post('updateArticle')
    public async updateArticle(@Response() res,@Body() article:UpdateArticle){
        let topPlace:string=article.topPlace.toString();
        if(topPlace=='global' || topPlace=='current'){}else if(topPlace=='level1' || topPlace=='level2'){}else if(topPlace=='level1'){}else{
            return res.status(403).send()
        }
        let art =new ArticleEntity();
        art.id =article.id;
        art.name=article.name;
        art.classifyId=article.classifyId;
        art.classify =article.classifyName;
        art.abstract=article.abstractArticle;
        art.topPlace =topPlace;
        art.hidden =article.hidden;
        art.content = article.content;
        art.publishedTime =new Date(Date.parse(article.publishedTime.replace(/-/g,"/")));
        art.source = article.source;
        art.sourceUrl =article.sourceUrl;
        let result=await this.articleService.updateArticle(art);
        let str:string=JSON.stringify(result);
        let final:string=`成功修改数据${str}`;
        return res.status(HttpStatus.OK).send(JSON.stringify(final));
    }

    /**
     * 回收站获取文章
     * @param res
     * @param {GetLimit} limit
     */
    @ApiOperation({title:'The article in the recycle bin.'})
    @Post('recycle')
    public async recycleFind(@Response() res,@Body() limit:GetLimitNum){
        let result:ArticleEntity[] =await this.articleService.recycleFind(limit.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 回收站内批量或者单个删除数据
     * @param res
     * @param {DeleteArticleId} array
     */
    @ApiOperation({title:'Delete data in recycle bin.'})
    @Post('recycleDelete')
    public async recycleDelete(@Response() res,@Body() array:DeleteArticleId){
     let result:number =await this.articleService.recycleDelete(array.id);
     let deleteNum:string =`已经成功删除${result}条数据`;
      return res.status(HttpStatus.OK).send(deleteNum);
    }

    /**
     * 批量或者单个还原回收站文章
     * @param res
     * @param {DeleteArticleId} array
     */
    @ApiOperation({title:'The article was restored at the recycle bin.'})
    @Post('recycleRestore')
    public async reductionArticle(@Response() res,@Body() array:DeleteArticleId){
        let num:number= await this.articleService.reductionArticle(array.id);
        let result:string=`成功将${num}条数据还原`;
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }
    /**
     * 分页获取置顶文章
     * @param res
     * @param {GetLimit} getLimit
     * @returns {Promise<void>}
     */
    @ApiOperation({title:'Get the top article for pagination.'})
    @Post('findTopPlace')
    public async findTopPlace(@Response() res,@Body() getLimit:GetLimit){
        let result:ArticleEntity[]= await this.articleService.findTopPlace(getLimit.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 回收站内分类获取文章
     * @param res
     * @param {GetClassifyLimit} getLimit
     * @returns {Promise<void>}
     */
    @ApiOperation({title:'Get the  article from  reduction by classify id.'})
    @Post('reductionGetByClassifyId')
    public async reductionGetByClassifyId(@Response() res,@Body() getLimit:GetClassifyLimit){
        let result:ArticleEntity[]=await this.articleService.reductionClassity(getLimit.id,getLimit.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }
    /**
     * 通过文章id获取文章
     * @param res
     * @param {showNextDto} getId
     * @returns {Promise<void>}
     */
    @ApiOperation({title:'get articles by id'})
    @Post('getArticleById')
    public async getArticleById(@Response() res,@Body() getId:showNextDto){
        let result:ArticleEntity[]=await this.articleService.getArticleById(getId.id);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

}