import {PageEntity} from "../../../entity/page.entity";
import {PageContentEntity} from "../../../entity/page.content.entity";

export class PageCurdEvent{
    constructor(
        public  page:PageEntity,
        public content:PageContentEntity[],
        public  array?:number[]
    ){}
}