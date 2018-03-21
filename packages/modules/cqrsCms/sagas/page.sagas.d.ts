import { EventObservable, ICommand } from "@nestjs/cqrs";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
export declare class PageSagas {
    articleXml: (events$: EventObservable<any>) => Observable<ICommand>;
    pageXml: (events$: EventObservable<any>) => Observable<ICommand>;
}
