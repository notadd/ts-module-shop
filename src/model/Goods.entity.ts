import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
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

    @Column({
        name: 'description',
        type: 'text'
    })
    description: string

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


}