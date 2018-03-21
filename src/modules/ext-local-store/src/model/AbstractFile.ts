import { Entity,Column,PrimaryGeneratedColumn,Index,ManyToOne,JoinColumn,OneToOne,CreateDateColumn,UpdateDateColumn} from 'typeorm';
import { Bucket } from './Bucket'


export class AbstractFile{
    
    @PrimaryGeneratedColumn({
        name:'id',
        type:'integer'
    })
    id: number;
  
    @Column({ 
        name:'raw_name',
        type:'varchar',
        length: 50,
        nullable:false
    })
    raw_name: string;

    @Column({ 
        name:'tags',
        type:'simple-array',
        nullable:true,
    })
    tags: string[];
  
    //本地存储中，文件名为它的sha256值有64位
    //为了与云存储统一，也称做name,这里统一空间下name不可以重复
    @Column({ 
        name:'name',
        type:'varchar',
        length: 100,
        nullable:false 
    })
    name: string;
  
    @Column({ 
        name:'type',
        type:'varchar',
        length: 20,
        nullable:true
    })
    type: string;
  
    @Column({
        name:'size',
        type:'integer',
        nullable:true
    })
    size: number;
  
    //访问密钥
    @Column({
        name:'content_secret',
        type:'varchar',
        length:'50',
        nullable:true
    })
    content_secret: string;

    @CreateDateColumn({
        name:'create_date',
        type:'date'
    })
    create_date:Date;

    @UpdateDateColumn({
        name:'update_date',
        type:'date'
    })
    update_date:Date;

}
