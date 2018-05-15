import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { PropertyValue } from "./property.value.entity";
import { OrderItem } from "./order.item.entity";
import { Goods } from "./goods.entity";

@Entity("sku")
export class Sku {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    no: string;

    @Column()
    inventory: number;

    @OneToMany(type => OrderItem, orderItem => orderItem.sku, {
        cascade: false,
        lazy: false,
        eager: false
    })
    orderItems: Array<OrderItem>;

    @ManyToMany(type => PropertyValue, {
        cascade: false,
        lazy: false,
        eager: false
    })
    @JoinTable()
    values: Array<PropertyValue>;

    @ManyToOne(type => Goods, goods => goods.skus, {
        cascade: false,
        lazy: false,
        eager: false
    })
    goods: Goods;

}
