import {AggregateRoot} from "@nestjs/cqrs";
import {SitemapCreateEvent} from "../events/impl/sitemap-create.event";
import {CreateParamCommand} from "../commands/impl/create-param.command";
import {SitemapUpdateEvent} from "../events/impl/sitemap-update.event";
export class Sitemap extends AggregateRoot{
    constructor(private readonly id:string){super();}
    updatexml(enemyId: string) {
        // logic
        console.log('修改xml文件');
        this.apply(new SitemapUpdateEvent(enemyId));
    }

    createxml(createParam: CreateParamCommand) {
        // logic
        console.log('model='+JSON.stringify(createParam));
        return this.apply(new SitemapCreateEvent(createParam.lc_is_Enabled_XML_Sitemap,createParam.lc_is_update_sitemap_when_post,createParam.lc_page_select,
            createParam.lc_post_limit1000,createParam.lc_post_select,createParam.lc_XML_FileName));
    }

}