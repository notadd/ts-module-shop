import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {ClassifyCurdEvents} from "../impl/classify-curd.events";
import {ClassifyService} from "../../../classify/classify.service";

const clc=require('cli-color');
@EventsHandler(ClassifyCurdEvents)
export class ClassifyCurdHandler implements IEventHandler<ClassifyCurdEvents> {
    constructor(readonly classifyservice: ClassifyService) {
    }
    async handle(event: ClassifyCurdEvents) {
        console.log(clc.yellowBright('Async create classify...'));
        //新增分类
        if(event.classify.createClassify){
            if(event.classify.useFor=='art'){
                await this.classifyservice.createClassifyArt(event.classify.createClassify);
            }
            if(event.classify.useFor=='page'){
                await this.classifyservice.createClassifyPage(event.classify.createClassify);
            }
        }
        //修改分类
        if(event.classify.updateClassify){
            if(event.classify.useFor=='art'){
                await this.classifyservice.updateClassifyArt(event.classify.updateClassify);
            }
            if(event.classify.useFor=='page'){
                await this.classifyservice.updateClassifyPage(event.classify.updateClassify);
            }
        }
        //删除分类
        if(event.classify.deleteClassify){
            if(event.classify.useFor=='art'){
                await this.classifyservice.deleteMethodFirst(event.classify.deleteClassify);
            }
            if(event.classify.useFor=='page'){
                await this.classifyservice.deleteMethodSecond(event.classify.deleteClassify);
            }
        }
        //移动分类
        if(event.classify.mobileClassifyId){
            if(event.classify.useFor=='art'){
                await this.classifyservice.mobileClassifyArt(event.classify.mobileClassifyId.id,event.classify.mobileClassifyId.parentId);
            }
            if(event.classify.useFor=='page'){
                await this.classifyservice.mobileClassifyPage(event.classify.mobileClassifyId.id,event.classify.mobileClassifyId.parentId);
            }
        }
    }
}