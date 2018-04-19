import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";


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

}