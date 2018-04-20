import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";

/* 配送类型实体 */
@Entity("delivery")
export class Delivery {

    @PrimaryGeneratedColumn()
    id: number;

    /* 配送名称 */
    @Column({
        length: 20,
        unique: true
    })
    name: string;

    /* 描述 */
    @Column({
        length: 50
    })
    description: string;

    /* 配送费 */
    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    cost: number;

    /* 免费额度 */
    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    freeLimit: number;

    /* 保价费 */
    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    valuationFee: number;
}
