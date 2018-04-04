import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ThirdClassify } from './ThirdClassify.entity';

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



}