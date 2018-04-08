import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { PropertyValue } from './PropertyValue.entity';
import { ThirdClassify } from './ThirdClassify.entity';
import { GoodsType } from './GoodsType.entity';

/* 商品实体，为一个商品的基本属性，名称、描述、基本价格等，一个商品必然属于一个分类、一个商品类型
   商品包含了多个属性值，有些为唯一属性，即直接属于商品，有些是单选、复选属性，属于指定价格的单品
*/
@Entity('goods')
export class Goods {

    @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
    id: number

    @Column({
        name: 'name',
        type: 'varchar',
        length: 50,
        unique: true
    })
    name: string

    /* 商品基本价格，最终价格由基本价格与属性价格相加决定 */
    @Column({
        name: 'base_price',
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    basePrice: number

    @Column({
        name: 'description',
        type: 'text'
    })
    description: string

    @Column({
        name:'classifyId'
    })
    classifyId:number

    /* 分类删除时，其下存在商品，需要报错，不级联删除 */
    @ManyToOne(type => ThirdClassify, thirdClassify => thirdClassify.goodses, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    classify: ThirdClassify

    /* 商品类型删除时，其下存在商品需要报错，不级联删除 */
    @ManyToOne(type => GoodsType, goodsType => goodsType.properties, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    type: GoodsType

    @OneToMany(type => PropertyValue, propertyValue =>propertyValue.goods, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    values:PropertyValue[]
}