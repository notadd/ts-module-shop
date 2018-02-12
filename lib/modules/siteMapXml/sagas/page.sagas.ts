import {EventObservable, ICommand} from "@nestjs/cqrs";
import {Observable} from "rxjs/Observable";
import {PageDeletedEvent} from "../events/impl/page-deleted.event";
import {DeleteParamCommand} from "../commands/impl/delete-param.command";
import {Component} from "@nestjs/common";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import {PageCreateEvent} from "../events/impl/page-create.event";
import {CreateParamCommand} from "../commands/impl/create-param.command";
import {SitemapUpdateEvent} from "../events/impl/sitemap-update.event";

const clc=require('cli-color');
const itemId='0';
@Component()
export class PageSagas{
    updatePages =(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(SitemapUpdateEvent)
            .delay(1000)
            .map(event => {
                console.log(clc.redBright('Inside [HeroesGameSagas] Saga'));
                return new DeleteParamCommand(event.heroId, itemId);
            })
    };
    /*deletePages =(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(PageDeletedEvent)
            .delay(1000)
            .map(event => {
                console.log(clc.redBright('Inside [HeroesGameSagas] Saga'));
                return new DeleteParamCommand(event.heroId, itemId);
            })
    };*/
   /* createPages=(events$:EventObservable<any>):Observable<ICommand> =>{
       return events$.ofType(PageCreateEvent)
           .delay(2000)
           .map(event=>{
               console.log(clc.redBright('Inside create [HeroesGameSagas] Saga'));
               return new CreateParamCommand(event.lc_XML_FileName,event.lc_is_Enabled_Html_Sitemap,event.lc_is_Enabled_XML_Sitemap,
               event.lc_category_select,event.lc_post_limit1000,event.lc_page_select)
           })
   }*/
}