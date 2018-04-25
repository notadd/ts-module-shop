import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { Order } from "./order.entity";
import { Sku } from "./sku.entity";

/* 订单项实体类，一个订单项代表了一定数量的sku，
直接购买时与订单一起创建，也可以先创建订单项，放入购物车，使用购物车创建订单 */
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

    /* 订单项所属用户 */
    @Column()
    userId: number;

    /* 多个订单项属于一个订单，当直接创建订单项时，所属订单为空 */
    @ManyToOne(type => Order, order => order.items, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        lazy: false,
        eager: false,
        nullable: true
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