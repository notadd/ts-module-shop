import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";

@Entity("evaluation")
export class Evaluation{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({length:200})
    content:string;

    @Column()
    display:boolean;

    @Column()
    userId:number;

    

}