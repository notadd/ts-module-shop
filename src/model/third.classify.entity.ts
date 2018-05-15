import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { SecondClassify } from "./second.classify.entity";
import { Goods } from "./goods.entity";

/* 三级分类实体，level默认为3，且其下可包含商品 */
@Entity("third_classify")
export class ThirdClassify {

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
        default: 3
    })
    level: number;

    @Column()
    parentId: number;

    /* 二级分类删除时，其下存在三级分类，需要报错，不级联删除 */
    @ManyToOne(type => SecondClassify, secondClassify => secondClassify.children, {
        cascade: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    parent: SecondClassify;

    @OneToMany(type => Goods, goods => goods.classify, {
        cascade: false,
        lazy: false,
        eager: false
    })
    goodses: Array<Goods>;

}
