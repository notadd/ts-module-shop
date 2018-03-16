import {IEvent} from "@nestjs/cqrs";
import {CreateXmlVm} from "../../models/view/create-xml-vm";

export class SitemapCreateEvent implements IEvent{
    constructor(public createXml:CreateXmlVm){}
}