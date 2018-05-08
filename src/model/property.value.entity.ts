import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { GoodsProperty } from "./goods.property.entity";
import { Goods } from "./goods.entity";

/* 属性值，代表了某个商品的某一属性的值，其中unique属性没有价格，radio、check属性都有相应的增量价格 */
@Entity("property_value")
export class PropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    value: string;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: true
    })
    price: number;

    /* 商品属性删除时，其下所有属性值级联删除 */
    @ManyToOne(type => GoodsProperty, goodsProperty => goodsProperty.values, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "CASCADE",
        nullable: false,
        lazy: false,
        eager: false
    })
    property: GoodsProperty;

    /* 商品删除时，所有属性值级联删除 */
    @ManyToOne(type => Goods, goods => goods.values, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "CASCADE",
        nullable: false,
        lazy: false,
        eager: false
    })
    goods: Goods;
}
