import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToOne ,CreateDateColumn,UpdateDateColumn} from 'typeorm';
import { AbstractFile } from './AbstractFile'
import { Bucket } from './Bucket.entity'

@Entity({
  name: 'image'
})
//同一空间下name不能重复，创建唯一性约束
@Index('name_bucket_id',['name','bucketId'],{unique:true})
export class Image extends AbstractFile{

  @Column({
    name: 'width',
    type: 'integer',
    nullable: true
  })
  width: number;

  @Column({
    name: 'height',
    type: 'integer',
    nullable: true
  })
  height: number;


  @Column({nullable:true})
  bucketId:number

  @ManyToOne(type => Bucket, bucket => bucket.images, {
    cascadeInsert:false,
    cascadeRemove: false,
    cascadeUpdate:false,
    nullable: false,
    lazy:false
  })
  @JoinColumn()
  bucket: Bucket
}