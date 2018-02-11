import {EventObservable, ICommand} from "@nestjs/cqrs";
import {Observable} from "rxjs/Observable";
import {PageDeletedEvent} from "../events/impl/page-deleted.event";
import {DeleteParamCommand} from "../commands/impl/delete-param.command";
import {Component} from "@nestjs/common";

const clc=require('cli-color');
const itemId='0';
@Component()
export class PageSagas{
    deletePages =(events$:EventObservable<any>):Observable<ICommand> =>{
        return events$.ofType(PageDeletedEvent)
            .delay(1000)
            .map(event => {
                console.log(clc.redBright('Inside [HeroesGameSagas] Saga'));
                return new DeleteParamCommand(event.heroId, itemId);
            })
    }
}