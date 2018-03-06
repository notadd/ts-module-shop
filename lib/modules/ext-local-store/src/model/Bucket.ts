import { Entity, Column, PrimaryColumn, Index, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Image } from './Image'
import { File } from './File'
import {ImageConfig} from "./ImageConfig";

@Entity('bucket')
export class Bucket {

  //主键，需要设置插入，1默认为公有空间配置，2默认为私有空间配置
  @PrimaryColumn()
  id: number;

  //公有还是私有空间，值为public、private
  @Column({length: 20, nullable: false, unique: true})
  public_or_private: string;


  //此空间下所有文件都存储于这个目录里,与虚拟目录无关
  @Column({
    length: 20,
    nullable: false
  })
  name: string;

  //token密钥
  @Column({
    length: 250,
    nullable: true
  })
  token_secret_key: string;

  //token过期时间，单位秒
  @Column({
    nullable: true
  })
  token_expire: number;

  /*这里lazy:false的意思不是每个Bucket查询出来的时候就会包含image_config
  它的意思只是在于获取的属性是否是Promise，而要查询出来的Bucket包含image_config，必须使用find({relation:xxxx})*/
  @OneToOne(type => ImageConfig,imageConfig=>imageConfig.bucket,{
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true,
        lazy: false
    })
    image_config: ImageConfig;
  @OneToMany(type => File, file => file.bucket, {
    cascadeInsert: true,
    cascadeUpdate: true,
    lazy: true
  })
  files?: Promise<File[]>;

  @OneToMany(type => Image, image => image.bucket, {
    cascadeInsert: true,
    cascadeUpdate: true,
    lazy: true
  })
  images?: Promise<Image[]>;
}