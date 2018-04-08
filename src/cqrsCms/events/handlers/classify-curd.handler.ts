import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {ClassifyCurdEvents} from "../impl/classify-curd.events";
import {ClassifyService} from "../../service/classify.service";

@EventsHandler(ClassifyCurdEvents)
export class ClassifyCurdEvent implements IEventHandler<ClassifyCurdEvents> {
    constructor(readonly classifyservice: ClassifyService) {
    }
    async handle(event: ClassifyCurdEvents) {
        //新增分类
        if(event.classify.createClassify){
            if(event.classify.useFor=='art'){
                await this.classifyservice.createClassifyArt(event.classify.createClassify.art);
            }
            if(event.classify.useFor=='page'){
                await this.classifyservice.createClassifyPage(event.classify.createClassify.page);
            }
        }
        //修改分类
        if(event.classify.updateClassify){
            if(event.classify.useFor=='art'){
                await this.classifyservice.updateClassifyArt(event.classify.updateClassify.art);
            }
            if(event.classify.useFor=='page'){
                await this.classifyservice.updateClassifyPage(event.classify.updateClassify.page);
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