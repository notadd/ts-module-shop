import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { GoodsProperty } from './GoodsProperty.entity';
import { Goods } from './Goods.entity';


/* 属性值，代表了某个商品的某一属性的值，其中unique属性没有价格，radio、check属性都有相应的增量价格 */
@Entity('property_value')
export class PropertyValue {

    @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
    id: number

    @Column({
        name: 'value',
        type: 'varchar',
        length: 20
    })
    value: string

    @Column({
        name: 'price',
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    price: number

    @ManyToOne(type => GoodsProperty, goodsProperty => goodsProperty.values, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    property: GoodsProperty

    @ManyToOne(type => Goods, goods => goods.values, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    goods: Goods
}