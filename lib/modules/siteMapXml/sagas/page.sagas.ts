import {EventObservable, ICommand} from "@nestjs/cqrs";
import {Observable} from "rxjs/Observable";
import {DeleteParamCommand} from "../commands/impl/delete-param.command";
import {Component} from "@nestjs/common";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import {PageCurdEvent} from "../events/impl/page-curd.event";
import {ArticleCurdEvents} from "../events/impl/article-curd.events";
import {GetPageParamCommand} from "../commands/impl/get-page-param.command";
import {GetArticleParamCommand} from "../commands/impl/get-article-param.command";
import {ClassifyCurdEvents} from "../events/impl/classify-curd.events";
import {ClassifyCurdEvent} from "../events/handlers/classify-curd.handler";
import {GetClassifyParamCommand} from "../commands/impl/get-classify-param.command";
const clc=require('cli-color');
const itemId='0';
@Component()
export class PageSagas{
    //文章、页面　增删改合并修改生成xml文件
    articleXml =(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(ArticleCurdEvents)
            .delay(1000)
            .map(event => {
                console.log(clc.redBright('Inside [PageSagas] Saga articleXml'));
                return new DeleteParamCommand(event.heroId, itemId);
            })
    };
    //页面增删改合并修改生成xml文件
    pageXml =(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(PageCurdEvent)
            .delay(1000)
            .map(event =>{
                console.log(clc.redBright('Inside [PageSagas] Saga pagexml'));
                return new DeleteParamCommand(event.heroId,itemId);
            })
    };
  /*  //获取全部页面
    getPages=(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(PageCurdEvent)
            .delay(1000)
            .map(event =>{
                console.log(clc.redBright('Inside [PageSagas] Saga getPages'));
                return new GetPageParamCommand({limit:event.pageEntity.limit,pages:event.pageEntity.pages,getAll:true});
            })
    };
    //获取全部文章
    getArticles=(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(ArticleCurdEvents)
            .delay(1000)
            .map(event => {
                console.log(clc.redBright('Inside [PageSagas] Saga getArticles'));
                return new GetArticleParamCommand({limitNum:event.article.limitNum,pages:event.article.pages});
            })
    };
    //获取全部分类
    getClassification=(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(ClassifyCurdEvents)
            .delay(1000)
            .map(event => {
                console.log(clc.redBright('Inside [PageSagas] Saga getClassify'));
                console.log('commandValue='+JSON.stringify(new GetClassifyParamCommand({useFor:event.classify.useFor})));
                return new GetClassifyParamCommand({useFor:event.classify.useFor});
            })
    };*/
}