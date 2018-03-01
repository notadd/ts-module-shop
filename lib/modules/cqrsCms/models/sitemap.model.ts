import {AggregateRoot} from "@nestjs/cqrs";
import {SitemapCreateEvent} from "../events/impl/sitemap-create.event";
import {CreateParamCommand} from "../commands/impl/create-param.command";
import {SitemapUpdateEvent} from "../events/impl/sitemap-update.event";
import {CreateXmlVm} from "./view/create-xml-vm";
export class Sitemap extends AggregateRoot{
    constructor(private readonly id:string){super();}
    updatexml(enemyId: string) {
        // logic
        console.log('修改xml文件');
        this.apply(new SitemapUpdateEvent(enemyId));
    }

    createxml(createParam: CreateXmlVm) {
        // logic
        console.log('create xml model='+JSON.stringify(createParam));
        return this.apply(new SitemapCreateEvent(createParam));
    }

}