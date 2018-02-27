import {PageEntity} from "../../../entity/page.entity";
import {PageContentEntity} from "../../../entity/page.content.entity";
import {CreatePageVm} from "../../models/view/create-page.vm";

export class PageCurdEvent{
    constructor(
        public  pageEntity:CreatePageVm
    ){}
}