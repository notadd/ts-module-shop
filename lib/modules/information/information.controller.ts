import {Controller, Get, HttpStatus, Response} from "@nestjs/common";
import {InformationService} from "./information.service";
import {ApiOperation} from "@nestjs/swagger";

@Controller('information')
export class InformationController{
    constructor(private readonly informationService:InformationService){}

    @ApiOperation({title:'find All information'})
    @Get('allInformation')
    public getAllInformation(@Response() res){
        const result=this.informationService.findAllInformation();
        res.status(HttpStatus.OK).send(JSON.stringify(result));
    }
}