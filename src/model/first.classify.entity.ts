import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { SecondClassify } from "./second.classify.entity";

/* 一级分类实体，其level默认为1 */
@Entity("first_classify")
export class FirstClassify {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20,
        unique: true
    })
    name: string;

    @Column({
        length: 100
    })
    description: string;

    @Column({
        default: 1
    })
    level: number;

    @OneToMany(type => SecondClassify, secondClassify => secondClassify.parent, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    children: Array<SecondClassify>;

}
