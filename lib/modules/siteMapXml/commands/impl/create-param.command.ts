import {ICommand} from "@nestjs/cqrs";
import {CreateXmlVm} from "../../models/view/create-xml-vm";

export class CreateParamCommand implements ICommand{
    constructor( public createXml:CreateXmlVm){}


}