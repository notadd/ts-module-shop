import { IEvent } from "@nestjs/cqrs";
import { CreateXmlVm } from "../../models/view/create-xml-vm";
export declare class SitemapCreateEvent implements IEvent {
    createXml: CreateXmlVm;
    constructor(createXml: CreateXmlVm);
}
