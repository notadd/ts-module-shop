import { Entity, Column, PrimaryColumn, Index, OneToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bucket } from './Bucket.entity'
/* 图片配置实体类 */
@Entity({
  name: 'image_config'
})
export class ImageConfig {

  //主键，需要设置插入，1默认为公有空间配置，2默认为私有空间配置
  @PrimaryColumn({
    name:'id',
    type:'integer'
  })
  id: number;
  //保存格式，raw、webp_damage、webp_undamage
  @Column({
    name: 'format',
    type: 'varchar',
    nullable: true
  })
  format: string;

  //是否启用水印，true、false
  @Column({
    name: 'watermark_enable',
    type: 'smallint',
    nullable: true
  })
  watermark_enable: number

  //水印图片保存的save_key，每个空间图片加水印使用自己空间下的水印图片，所以水印图片要保存两次
  @Column({
    name: 'watermark_save_key',
    type: 'varchar',
    length: 80,
    nullable: true
  })
  watermark_save_key: string;

  //水印位置，九宫格
  @Column({
    name: 'watermark_gravity',
    type: 'varchar',
    nullable: true
  })
  watermark_gravity: string;

  //水印横轴偏移
  @Column({
    name: 'watermark_x',
    type: 'integer',
    nullable: true
  })
  watermark_x: number;

  //水印纵轴偏移
  @Column({
    name: 'watermark_y',
    type: 'integer',
    nullable: true
  })
  watermark_y: number;

  //水印透明度
  @Column({
    name: 'watermark_opacity',
    type: 'integer',
    nullable: true
  })
  watermark_opacity: number;

  //水印与图片短边自适应比例
  @Column({
    name: 'watermark_ws',
    type: 'integer',
    nullable: true
  })
  watermark_ws: number;

  @OneToOne(type => Bucket, bucket => bucket.image_config)
  @JoinColumn()
  bucket: Bucket;
}