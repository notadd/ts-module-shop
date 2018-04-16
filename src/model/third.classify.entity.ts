import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { SecondClassify } from "./second.classify.entity";
import { Goods } from "./goods.entity";

/* 三级分类实体，level默认为3，且其下可包含商品 */
@Entity("third_classify")
export class ThirdClassify {

    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column({
        name: "name",
        type: "varchar",
        length: 20,
        unique: true
    })
    name: string;

    @Column({
        name: "description",
        type: "varchar",
        length: 100
    })
    description: string;

    @Column({
        name: "level",
        type: "integer",
        default: 3
    })
    level: number;

    @Column({ name: "parentId" })
    parentId: number;

    /* 二级分类删除时，其下存在三级分类，需要报错，不级联删除 */
    @ManyToOne(type => SecondClassify, secondClassify => secondClassify.children, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    parent: SecondClassify;

    @OneToMany(type => Goods, goods => goods.classify, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    goodses: Array<Goods>;

}