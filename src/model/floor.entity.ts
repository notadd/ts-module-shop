import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { Goods } from "./goods.entity";


@Entity("floor")
export class Floor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20, unique: true })
    name: string;

    @Column()
    display: boolean;

    @OneToMany(type => Goods, goods => goods.floor, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    goodses: Array<Goods>;
}