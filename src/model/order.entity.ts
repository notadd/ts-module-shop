import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";
import { UserReceivingInformation } from "./user.receiving.information.entity";
import { Delivery } from "./delivery.entity";


@Entity("order")
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @Column()
    userId: number;

    @Column({
        length: 30
    })
    delivertNo: string;

    @Column()
    delivertTime: Date;

    @Column({
        length: 20
    })
    InvoiceType: string;

    @Column({
        length: 100
    })
    invoiceContent: string;

    @Column({
        length: 20
    })
    invoiceTitle: string;

    @Column({
        length: 20
    })
    customerMessage: string;

    @OneToOne(type => Delivery, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        lazy: false,
        eager: false
    })
    delivery: Delivery;

    @OneToOne(type => UserReceivingInformation, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        lazy: false,
        eager: false
    })
    receivingInformation: UserReceivingInformation;
}