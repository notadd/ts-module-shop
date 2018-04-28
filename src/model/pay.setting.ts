import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable, OneToMany, ManyToMany, ManyToOne } from "typeorm";

@Entity("pay_setting")
export class PaySetting {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    aliPay: boolean;

    @Column()
    weixinPay: boolean;
}