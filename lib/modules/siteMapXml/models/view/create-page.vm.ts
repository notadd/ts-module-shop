import {PageEntity} from "../../../entity/page.entity";
import {PageContentEntity} from "../../../entity/page.content.entity";

export class CreatePageVm{
   /* public readonly  title:string;
    //页面别名
    public readonly  alias:string;
    //页面分类Id
    public readonly  classifyId:number;
    //页面分类Id
    public readonly  classify:string;
    //页面内容
    public readonly  contents:[string]*/
    public  page?:PageEntity;
    public content?:PageContentEntity[];
    public limit:number;
    public pages:number;
    public array?:number[];
}