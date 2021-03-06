import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";
import { UserReceivingInformation } from "./user.receiving.information.entity";
import { OrderItem } from "./order.item.entity";
import { Delivery } from "./delivery.entity";

/* 订单实体类 */
@Entity("order")
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    /* 订单号 */
    @Column()
    orderNo: string;

    /* 创建日期 */
    @CreateDateColumn()
    createDate: Date;

    /* 更新日期 */
    @UpdateDateColumn()
    updateDate: Date;

    /* 订单所属用户id */
    @Column()
    userId: number;

    /* 发货单号 */
    @Column({
        length: 30
    })
    delivertNo: string;

    /* 发货时间 */
    @Column({
        type: "timestamp"
    })
    delivertTime: Date;

    /* 发票类型 */
    @Column({
        length: 20
    })
    invoiceType: string;

    /* 发票内容 */
    @Column({
        length: 100
    })
    invoiceContent: string;

    /* 发票抬头 */
    @Column({
        length: 20
    })
    invoiceTitle: string;

    /* 客户消息 */
    @Column({
        length: 20
    })
    customerMessage: string;

    @Column({ nullable: true })
    deliveryId: number;

    @Column({ nullable: true })
    receivingInformationId: number;

    /* 订单配送信息 */
    @ManyToOne(type => Delivery, {
        cascade: false,
        lazy: false,
        eager: false
    })
    delivery: Delivery;

    /* 订单对应的订单项，包含了sku以及购买数量 */
    @OneToMany(type => OrderItem, orderItem => orderItem.order, {
        cascade: false,
        lazy: false,
        eager: false
    })
    orderItems: Array<OrderItem>;

    /* 收货人信息 */
    @ManyToOne(type => UserReceivingInformation, {
        cascade: false,
        lazy: false,
        eager: false
    })
    userReceivingInformation: UserReceivingInformation;
}
