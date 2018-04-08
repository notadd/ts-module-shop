import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany,ManyToOne } from 'typeorm';
import { FirstClassify } from './FirstClassify.entity';
import { ThirdClassify } from './ThirdClassify.entity';


/* 二级分类实体，其level默认为2 */
@Entity('second_classify')
export class SecondClassify {


    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number

    @Column({
        name: 'name',
        type: 'varchar',
        length: 20,
        unique: true
    })
    name: string

    @Column({
        name: 'description',
        type: 'varchar',
        length: 100
    })
    description: string

    @Column({
        name:'level',
        type:'integer',
        default:2
    })
    level:number

    @ManyToOne(type=>FirstClassify,firstClassify=>firstClassify.children,{
        cascadeInsert:false,
        cascadeUpdate:false,
        cascadeRemove:false,
        onDelete:"RESTRICT",
        nullable:false,
        lazy:false,
        eager:false
    })
    parent:FirstClassify

    @OneToMany(type=>ThirdClassify,thirdClassify=>thirdClassify.parent,{
        cascadeInsert:false,
        cascadeUpdate:false,
        lazy:false,
        eager:false
    })
    children:ThirdClassify[]



}