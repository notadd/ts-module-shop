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

    @ManyToMany(type => Goods, goods => goods.floors, {
        cascade: false,
        lazy: false,
        eager: false
    })
    @JoinTable()
    goodses: Array<Goods>;
}
