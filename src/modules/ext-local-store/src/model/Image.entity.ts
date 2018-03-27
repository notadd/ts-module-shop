import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AbstractFile } from './AbstractFile'
import { Bucket } from './Bucket.entity'

@Entity({
  name: 'image'
})
export class Image extends AbstractFile {

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

  @Column({
    name: 'frames',
    type: 'integer',
    nullable: true
  })
  frames: number;


  @Column({ nullable: true })
  bucketId: number

  @ManyToOne(type => Bucket, bucket => bucket.images, {
    cascadeInsert: false,
    cascadeRemove: false,
    cascadeUpdate: false,
    nullable: false,
    lazy: false
  })
  @JoinColumn()
  bucket: Bucket
}