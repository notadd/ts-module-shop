import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, Index } from "typeorm";
import { PropertyValue } from "./property.value.entity";
import { GoodsType } from "./goods.type.entity";

/* 商品属性实体，属于商品类型，其下包含了多个属性值
   主要按照类型区分为unique、radio、check三种类型，其中unique为属于商品的属性，与价格无关
   radio、check为属于单品的属性，与指定增量价格有关，商品最终价格由基本价格与所选属性价格的总和决定
*/
@Entity("goods_property")
@Index("name_type_id", ["name", "goodsTypeId"])
export class GoodsProperty {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    name: string;

    /* 属性类型，即属性是属于商品还是单品，属性与单品的关系
       unique：唯一属性，即属于商品的属性，对于所有单品来说是一样的
       radio：单选属性，只可以选择一个属性值，属性值对应的价格会被加到总价中
       check：复选属性，可以选择多个属性值，多个值对应的价格都会被加到总价中
    */
    @Column({
        length: 20
    })
    type: string;

    /* 属性录入方式，即属性输入的方式
       text：普通文本
       list：列表中选择
       textarea：多行文本框
    */
    @Column({
        length: 20
    })
    inputType: string;

    /* 当属性录入方式为list时，所有列表值 */
    @Column({
        type: "simple-array",
        nullable: true
    })
    list: Array<string>;

    @Column()
    goodsTypeId: number;

    /* 商品类型删除时，其下属性级联删除，注意此时要保证商品类型下没有商品 */
    @ManyToOne(type => GoodsType, goodsType => goodsType.properties, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "CASCADE",
        nullable: false,
        lazy: false,
        eager: false
    })
    goodsType: GoodsType;

    @OneToMany(type => PropertyValue, propertyValue => propertyValue.property, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    values: Array<PropertyValue>;
}
