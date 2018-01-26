import {Body, Controller, Get, HttpStatus, Post, Response} from "@nestjs/common";
import {PageService} from "./page.service";
import {ApiOperation} from "@nestjs/swagger";
import {PageSerach} from "../common/param.dto";
import {DeleteArticleId} from "../common/param.dto";
import {CreatePage} from "../common/param.dto";
import {showNextDto} from "../common/param.dto";
import {GetLimit} from "../common/param.dto";
import {UpdatePage} from "../common/param.dto";
import {ContentMap} from "../common/param.dto";
import {PageEntity} from "../entity/page.entity";
import {PageContentEntity} from "../entity/page.content.entity";

@Controller('page')
export class PageController{
    constructor( private readonly pageService:PageService){}
    /**
     * 获取全部页面
     * @param res
     */
    @ApiOperation({title:'get All pages'})
    @Get('getAllPage')
    public async getAllPage(@Response() res,@Body() getLimit:GetLimit){
        let result:PageEntity[]=await this.pageService.getAllPage(getLimit.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 通过关键字全局搜索
     * @param res
     * @param {PageSerach} keywords
     */
    @ApiOperation({title:'get pages by keywords'})
    @Post('serachPages')
    public async serachPages(@Response() res,@Body() keywords:PageSerach){
        let result:PageEntity[]=await this.pageService.serachKeywords(keywords.keyWords);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 批量或者单个删除页面，并记入历史表
     * @param res
     * @param {DeleteArticleId} array
     */
    @ApiOperation({title:'delete pages'})
    @Post('deletePages')
    public async deletePages(@Response() res,@Body() array:DeleteArticleId){
        let result:number=await this.pageService.deletePages(array.id);
        console.log('num='+result)
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
    public async createPages(@Response() res,@Body() page:CreatePage){
        let newPage =new PageEntity();
        newPage.title = page.title;
        newPage.alias = page.alias;
        newPage.classify = page.classify;
        let contents:PageContentEntity[]=[];
        let str:string[]=page.content;
        for(let t in str){
            let newContent:PageContentEntity=new PageContentEntity;
            newContent.content=str[t];
            contents.push(newContent);
        }
        console.log('contents='+JSON.stringify(contents));
        let result:PageEntity[]=await this.pageService.createPages(newPage,contents);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 修改页面
     * @param res
     * @param {CreatePage} page
     */
    @ApiOperation({title:'update pages'})
    @Post('updatePages')
    public async updatePages(@Response() res,@Body() page:UpdatePage){
        let newPage =new PageEntity();
        newPage.id = page.id;
        newPage.title = page.title;
        newPage.alias = page.alias;
        newPage.classify = page.classify;
        let content:ContentMap[]=page.contents;
        let contents:PageContentEntity[]=[];
        for(let t in content){
            let newContent:PageContentEntity=new PageContentEntity;
            newContent.content=content[t].content;
            newContent.id=content[t].id;
            contents.push(newContent);
        }
        console.log('contents='+JSON.stringify(content));
        let result:PageEntity[]=await this.pageService.updatePages(newPage,contents);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 根据id查找页面
     * @param res
     * @param {showNextDto} page
     * @returns {Promise<void>}
     */
    @ApiOperation({title:'find page by id'})
    @Post('findPageById')
    public async findPageById(@Response() res,@Body() page:showNextDto){
        let id:number=page.id;
        let result:PageEntity=await this.pageService.findPageById(id);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

}