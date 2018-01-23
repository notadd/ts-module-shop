import {Body, Controller, Get, HttpStatus, Post, Response} from "@nestjs/common";
import {ClassifyService} from "./classify.service";
import {ApiOperation} from "@nestjs/swagger";
import {CreateClassify} from "../common/param.dto";
import {GetClassify} from "../common/param.dto";
import {UpdateClassify} from "../common/param.dto";
import {DeleteDto} from "../common/param.dto";
import {showNextDto} from "../common/param.dto";
import {ClassifyEntity} from "../entity/classify.entity";
import {ArticleEntity} from "../entity/article.entity";

@Controller('classify')
export class ClassifyController{
    constructor(private classifyService:ClassifyService){}
    /**
     * 获取所有分类
     * @param res
     */
    @ApiOperation({title:'Get all categories'})
    @Post('getAllClassify')
    public getAllClassify(@Response() res,@Body() useFor:GetClassify){
        const result=this.classifyService.findAllClassify(useFor.usedFor);
        res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 新增分类
     * @param res
     * @param {CreateClassify} entity
     */
    @ApiOperation({title:'create a classification'})
    @Post('createClassify')
    public async createClassify(@Response() res,@Body() entity:CreateClassify){
      let classify =new ClassifyEntity();
      classify.classifyName = entity.classifyName;
      classify.classifyAlias = entity.classifyAlias;
      classify.chainUrl = entity.chainUrl;
      classify.describe = entity.describe;
      classify.color = entity.color;
      classify.groupId =entity.parentId;
      let result:ClassifyEntity[] = await this.classifyService.createClassify(classify,entity.usedFor);
      res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 修改分类
     * @param res
     * @param {CreateClassify} entity
     */
    @ApiOperation({title:'update a classification'})
    @Post('updateClassify')
    public updateClassify(@Response() res,@Body() entity:UpdateClassify){
        let classify =new ClassifyEntity();
        classify.id = entity.id;
        classify.classifyName = entity.classifyName;
        classify.classifyAlias = entity.classifyAlias;
        classify.chainUrl = entity.chainUrl;
        classify.describe = entity.describe;
        classify.color = entity.color;
        classify.groupId = entity.parentId;
        const result =  this.classifyService.updateClassify(classify,entity.usedFor);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 通过Id删除分类
     * @param res
     * @param {DeleteDto} deleteId
     */
    @ApiOperation({title:'Delete the classification by id.'})
    @Post('deleteClassify')
    public deleteClassifyById(@Response() res,@Body() deleteId:DeleteDto){
      const result=this.classifyService.deleteClassify(deleteId.id,deleteId.usedFor);
      return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 显示子级分类文章
     * @param res
     * @param {DeleteDto} showNextId
     */
    @ApiOperation({title:'Show the next level of the article by id.'})
    @Post('showNext')
    public async showNext(@Response() res,@Body() showNextId:showNextDto){
      let result:ArticleEntity[]=await this.classifyService.showNextTitle(showNextId.id);
      return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }


}