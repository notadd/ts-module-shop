import { ICommand } from "@nestjs/cqrs";
import { CreateXmlVm } from "../../models/view/create-xml-vm";
export declare class CreateParamCommand implements ICommand {
    createXml: CreateXmlVm;
    constructor(createXml: CreateXmlVm);
}
