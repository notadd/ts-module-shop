import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,OneToMany } from 'typeorm';
import { SecondClassify } from './SecondClassify.entity';


@Entity('first_classify')
export class FirstClassify{

    @PrimaryGeneratedColumn({type:'integer',name:'id'})
    id:number

    @Column({
        name:'name',
        type:'varchar',
        length:20,
        unique:true
    })
    name:string

    @Column({
        name:'description',
        type:'varchar',
        length:100
    })
    description:string

    @Column({
        name:'level',
        type:'integer',
        default:1
    })
    level:number

    @OneToMany(type=>SecondClassify,secondClassify=>secondClassify.parent,{
        cascadeInsert:false,
        cascadeUpdate:false,
        lazy:false,
        eager:false
    })
    children:SecondClassify[]

}