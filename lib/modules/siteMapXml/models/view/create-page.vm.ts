import {PageEntity} from "../../../entity/page.entity";
import {PageContentEntity} from "../../../entity/page.content.entity";

export class CreatePageVm{
    public  page?:PageEntity;
    public content?:PageContentEntity[];
    public limit:number;
    public pages:number;
    public array?:number[];
}