import { Entity,Column,PrimaryGeneratedColumn,Index,ManyToOne,JoinColumn,OneToOne,CreateDateColumn,UpdateDateColumn} from 'typeorm';
import { Bucket } from './Bucket'


export class AbstractFile{
    
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({length: 50, nullable:false})
    raw_name: string;

    @Column({type:'simple-array', nullable:true})
    tags: string[];
  
    //本地存储中，文件名为它的sha256值有64位
    //为了与云存储统一，也称做name,这里统一空间下name不可以重复
    @Column({length: 100, nullable:false})
    name: string;
  
    @Column({length: 20, nullable:true})
    type: string;
  
    @Column({nullable:true})
    size: number;
  
    //访问密钥
    @Column({length:'50', nullable:true})
    content_secret: string;

    @CreateDateColumn()
    create_date:Date;

    @UpdateDateColumn()
    update_date:Date;

}
