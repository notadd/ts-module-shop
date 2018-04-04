import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany,ManyToOne } from 'typeorm';
import { SecondClassify } from './SecondClassify.entity';

@Entity('third_classify')
export class ThirdClassify {

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
        default:3
    })
    level:number

    @ManyToOne(type=>SecondClassify,secondClassify=>secondClassify.children,{
        cascadeInsert:false,
        cascadeUpdate:false,
        cascadeRemove:false,
        onDelete:"RESTRICT",
        nullable:false,
        lazy:false,
        eager:false
    })
    parent:SecondClassify

}