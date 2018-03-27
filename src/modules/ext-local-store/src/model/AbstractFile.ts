import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Bucket } from './Bucket.entity'


export class AbstractFile {

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'integer'
    })
    id: number;

    @Column({
        name: 'raw_name',
        type: 'varchar',
        length: 50,
        nullable: false
    })
    raw_name: string;

    @Column({
        name: 'name',
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true
    })
    name: string;

    @Column({
        name: 'tags',
        type: 'simple-array',
        nullable: true,
    })
    tags: string[];

    @Column({
        name: 'md5',
        type: 'varchar',
        length: 50,
        nullable: false
    })
    md5: string;

    @Column({
        name: 'type',
        type: 'varchar',
        length: 20,
        //File可以没有扩展名
        nullable: true
    })
    type: string;

    @Column({
        name: 'size',
        type: 'integer',
        nullable: true
    })
    size: number;

    //访问密钥
    @Column({
        name: 'content_secret',
        type: 'varchar',
        length: '50',
        nullable: true
    })
    content_secret: string;

    @Column({
        name: 'status',
        type: 'varchar',
        nullable: false
    })
    status: string;


    @CreateDateColumn({
        name: 'create_date',
        type: 'date'
    })
    create_date: Date;

    @UpdateDateColumn({
        name: 'update_date',
        type: 'date'
    })
    update_date: Date;


}
