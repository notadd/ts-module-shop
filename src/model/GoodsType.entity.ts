import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { GoodsProperty } from './GoodsProperty.entity';
import { Goods } from './Goods.entity';

@Entity('goods_type')
export class GoodsType {

    @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
    id: number

    @Column({
        name: 'name',
        type: 'varchar',
        length: 20,
        unique: true
    })
    name: string

    @OneToMany(type => GoodsProperty, goodsProperty => goodsProperty.type, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    properties: GoodsProperty[]

    @OneToMany(type => Goods, goods => goods.classify, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    goodses: Goods[]

}