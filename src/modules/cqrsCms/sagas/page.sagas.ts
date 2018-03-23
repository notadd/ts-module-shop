import {EventObservable, ICommand} from "@nestjs/cqrs";
import {Observable} from "rxjs/Observable";
import {DeleteParamCommand} from "../commands/impl/delete-param.command";
import {Component} from "@nestjs/common";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import {PageCurdEvent} from "../events/impl/page-curd.event";
import {ArticleCurdEvents} from "../events/impl/article-curd.events";
const clc=require('cli-color');
const itemId='0';
@Component()
export class PageSagas{
    //文章、页面　增删改合并修改生成xml文件
    articleXml =(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(ArticleCurdEvents)
            .delay(1000)
            .map(event => {
                return new DeleteParamCommand(event.heroId, itemId);
            })
    };
    //页面增删改合并修改生成xml文件
    pageXml =(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(PageCurdEvent)
            .delay(1000)
            .map(event =>{
                return new DeleteParamCommand(event.heroId,itemId);
            })
    };
}