import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";


@Entity("order")
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    status: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @Column()
    userId: number;

    @Column()
    delivertTime: Date;

    @OneToOne(type => Delivery, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        lazy: false,
        eager: false
    })
    delivery: Delivery;

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

    @Column({
        length: 20
    })
    consignee: string;
}