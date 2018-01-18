import {Body, Controller, Get, HttpStatus, Post, Response} from "@nestjs/common";
import {ClassifyService} from "./classify.service";
import {ApiOperation} from "@nestjs/swagger";
import {CreateClassify} from "../common/param.dto";
import {UpdateClassify} from "../common/param.dto";
import {DeleteDto} from "../common/param.dto";
import {ClassifyEntity} from "../entity/classify.entity";

@Controller('classify')
export class ClassifyController{
    constructor(private classifyService:ClassifyService){}
    /**
     * 获取所有导航
     * @param res
     */
    @ApiOperation({title:'Get all categories'})
    @Get('getAllClassify')
    public getAllClassify(@Response() res){
        const result=this.classifyService.findAllClassify();
        res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 新增分类
     * @param res
     * @param {CreateClassify} entity
     */
    @ApiOperation({title:'create a classification'})
    @Post('createClassify')
    public createClassify(@Response() res,@Body() entity:CreateClassify){
      let classify =new ClassifyEntity();
      classify.classifyName = entity.classifyName;
      classify.classifyAlias = entity.classifyAlias;
      classify.chainUrl = entity.chainUrl;
      classify.describe = entity.describe;
      classify.color = entity.color;
      classify.showNext = entity.showNext;
      classify.groupId =entity.parentId;
      const result = this.classifyService.createClassify(classify);
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
        classify.showNext = entity.showNext;
        classify.groupId = entity.parentId;
        const result =  this.classifyService.updateClassify(classify);
        res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 通过Id删除分类
     * @param res
     * @param {DeleteDto} deleteId
     */
    @ApiOperation({title:'Delete the classification by id.'})
    @Post('deleteClassify')
    public deleteById(@Response() res,@Body() deleteId:DeleteDto){

    }

}