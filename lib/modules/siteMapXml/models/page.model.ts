import {AggregateRoot} from "@nestjs/cqrs";
import {PageDeletedEvent} from "../events/impl/page-deleted.event";
import {PageCreateEvent} from "../events/impl/page-create.event";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
export class Page extends AggregateRoot{
    constructor(private readonly id:string){super();}
    killEnemy(enemyId: string) {
        // logic
         this.apply(new PageDeletedEvent(enemyId));
    }

    addItem(itemId: string) {
        // logic
         return this.apply(new PageCreateEvent(itemId));
    }
}