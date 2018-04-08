import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, Index } from 'typeorm';
import { GoodsType } from './GoodsType.entity';


@Entity('goods_property')
@Index('name_type_id', ['name', 'typeId'])
export class GoodsProperty {

    @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
    id: number

    @Column({
        name: 'name',
        type: 'varchar',
        length: 20
    })
    name: string

    @Column({
        name: 'is_sku',
        type: 'smallint'
    })
    isSku: boolean

    @Column({
        name: 'is_enum',
        type: 'smallint'
    })
    isEnum: boolean

    @Column({
        name: 'enum',
        type: 'simple-array'
    })
    enum: string[]

    @Column({
        name: 'typeId'
    })
    typeId: number

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