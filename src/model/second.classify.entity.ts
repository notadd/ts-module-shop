import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { FirstClassify } from "./first.classify.entity";
import { ThirdClassify } from "./third.classify.entity";

/* 二级分类实体，其level默认为2 */
@Entity("second_classify")
export class SecondClassify {

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
        default: 2
    })
    level: number;

    @Column()
    parentId: number;

    /* 一级分类删除时，如果其下存在二级分类，需要报错，也就是不级联删除 */
    @ManyToOne(type => FirstClassify, firstClassify => firstClassify.children, {
        cascade: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    parent: FirstClassify;

    @OneToMany(type => ThirdClassify, thirdClassify => thirdClassify.parent, {
        cascade: false,
        lazy: false,
        eager: false
    })
    children: Array<ThirdClassify>;

}
