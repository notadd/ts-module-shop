import {Body, Controller, Get, HttpStatus, Post, Response} from "@nestjs/common";
import {PageService} from "./page.service";
import {ApiOperation} from "@nestjs/swagger";
import {PageSerach} from "../common/param.dto";
import {DeleteArticleId} from "../common/param.dto";
import {CreatePage} from "../common/param.dto";
import {PageEntity} from "../entity/page.entity";

@Controller('page')
export class PageController{
    constructor( private readonly pageService:PageService){}
    /**
     * 获取全部页面
     * @param res
     */
    @ApiOperation({title:'get All pages'})
    @Get('getAllPage')
    public getAllPage(@Response() res){
        const result=this.pageService.getAllPage();
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 通过关键字全局搜索
     * @param res
     * @param {PageSerach} keywords
     */
    @ApiOperation({title:'get pages by keywords'})
    @Post('serachPages')
    public serachPages(@Response() res,@Body() keywords:PageSerach){
        const result=this.pageService.serachKeywords(keywords.keyWords);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 批量或者单个删除页面，并记入历史表
     * @param res
     * @param {DeleteArticleId} array
     */
    @ApiOperation({title:'delete pages'})
    @Post('deletePages')
    public deletePages(@Response() res,@Body() array:DeleteArticleId){
        const result=this.pageService.deletePages(array.id);
        let deleteNum=`已经成功删除${result}个页面`;
        return res.status(HttpStatus.OK).send(JSON.stringify(deleteNum));
    }

    /**
     * 新增页面
     * @param res
     * @param {CreatePage} page
     */
    @ApiOperation({title:'create pages'})
    @Post('createPages')
    public createPages(@Response() res,@Body() page:CreatePage){
        let newPage =new PageEntity();
        newPage.title = page.title;
        newPage.alias = page.alias;
        newPage.classify = page.classify;
        newPage.open =page.open;
        newPage.content =page.content;
        const result=this.pageService.createPages(newPage);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }
}