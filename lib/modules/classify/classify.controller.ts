import {Body, Controller, Get, HttpStatus, Post, Response} from "@nestjs/common";
import {ClassifyService} from "./classify.service";
import {ApiOperation} from "@nestjs/swagger";
import {CreateClassify} from "../common/param.dto";
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
        const result=this.classifyService.findAllClassify(1);
        res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    @ApiOperation({title:'create a classification'})
    @Post('createClassify')
    public createClassify(@Response() res,@Body() entity:CreateClassify){
      let classify =new ClassifyEntity();
      classify.classifyName = entity.classifyName;
      classify.classifyAlias = entity.classifyAlias;
      classify.chainUrl = entity.chainUrl;
      classify.describe = entity.describe;
      classify.color = entity.color;
      const result = this.classifyService.createClassify(classify,entity.parentClassify);
      res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

}