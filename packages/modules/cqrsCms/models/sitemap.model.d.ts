import { AggregateRoot } from "@nestjs/cqrs";
import { CreateXmlVm } from "./view/create-xml-vm";
export declare class Sitemap extends AggregateRoot {
    private readonly id;
    constructor(id: string);
    updatexml(enemyId: string): void;
    createxml(createParam: CreateXmlVm): void;
}
