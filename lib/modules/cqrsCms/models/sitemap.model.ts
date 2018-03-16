import {AggregateRoot} from "@nestjs/cqrs";
import {SitemapCreateEvent} from "../events/impl/sitemap-create.event";
import {SitemapUpdateEvent} from "../events/impl/sitemap-update.event";
import {CreateXmlVm} from "./view/create-xml-vm";
export class Sitemap extends AggregateRoot{
    constructor(private readonly id:string){super();}
    updatexml(enemyId: string) {
        // logic
        this.apply(new SitemapUpdateEvent(enemyId));
    }

    createxml(createParam: CreateXmlVm) {
        // logic
        this.apply(new SitemapCreateEvent(createParam));
    }

}