import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

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

}