import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";

@Entity("delivery_type")
export class DeliveryType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    name: string;

    @Column({
        length: 50
    })
    description: string;

    @Column({
        type: "decimal",
        percision: 10,
        scale: 2
    })
    deliveryCost: number;

    @Column({
        type: "decimal",
        percision: 10,
        scale: 2
    })
    freeLimit: number;

    @Column({
        type: "decimal",
        percision: 10,
        scale: 2
    })
    ValuationFee: number;
}