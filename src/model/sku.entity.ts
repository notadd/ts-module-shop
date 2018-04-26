import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable,OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { PropertyValue } from "./property.value.entity";
import { Goods } from "./goods.entity";

@Entity("sku")
export class Sku {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    no: string;

    @Column()
    inventory: number;

    @ManyToMany(type => PropertyValue, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    @JoinTable()
    values: Array<PropertyValue>;

    @ManyToOne(type => Goods, goods => goods.skus, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        lazy: false,
        eager: false
    })
    goods: Goods;

}