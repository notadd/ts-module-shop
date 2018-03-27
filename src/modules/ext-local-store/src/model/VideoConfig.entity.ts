import { Entity, Column, PrimaryColumn, Index, OneToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bucket } from './Bucket.entity'

/* 视频配置实体类 */
@Entity({
  name: 'video_config'
})
export class VideoConfig {

  //主键，需要设置插入，1默认为公有空间配置，2默认为私有空间配置
  @PrimaryColumn({
    name:'id',
    type:'integer'
  })
  id: number;

  //保存格式，raw、vp9、h264、h265
  @Column({
    name: 'format',
    type: 'varchar',
    nullable: true
  })
  format: string;


  //分辨率，raw、1080p、720p、480p
  @Column({
    name: 'resolution',
    type: 'varchar',
    nullable: true
  })
  resolution: string;

  @OneToOne(type => Bucket, bucket => bucket.video_config)
  @JoinColumn()
  bucket: Bucket;
}