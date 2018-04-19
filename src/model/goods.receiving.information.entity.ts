import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";

@Entity("goods_receiving_information")
export class GoodsReceivingInformation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    consignee: string;

    @Column({
        length: 20
    })
    email: string;

    @Column({
        length: 50
    })
    addresss: string;

    @Column({
        length: 20
    })
    postCode: string;

    @Column({
        length: 20
    })
    homePhone: string;

    @Column({
        length: 20
    })
    mobilePhone: string;

}