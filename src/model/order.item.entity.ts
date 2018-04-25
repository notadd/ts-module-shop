import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { Order } from "./order.entity";
import { Sku } from "./sku.entity";

/* 订单项实体类，一个订单项代表了一定数量的sku */
@Entity("order_item")
export class OrderItem {

    @PrimaryGeneratedColumn()
    id: number;

    /* sku的数量，即购买数量 */
    @Column()
    count: number;

    /* skuId,由于是一对一关系，所以外键为unique */
    @Column({
        unique: true
    })
    skuId: number;

    /* 多个订单项属于一个订单 */
    @ManyToOne(type => Order, order => order.items, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        lazy: false,
        eager: false
    })
    order: Order;

    /* 一个订单项对应一个sku */
    @OneToOne(type => Sku, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    sku: Sku;

}