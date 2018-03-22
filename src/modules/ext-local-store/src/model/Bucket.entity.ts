import { Entity, Column, PrimaryColumn, Index, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ImageConfig } from './ImageConfig.entity'
import { AudioConfig } from './AudioConfig.entity'
import { VideoConfig } from './VideoConfig.entity'
import { Document } from './Document.entity'
import { Image } from './Image.entity'
import { Video } from './Video.entity'
import { Audio } from './Audio.entity'
import { File } from './File.entity'

@Entity({
  name: 'bucket'
})
export class Bucket {

  //主键，需要设置插入，1默认为公有空间配置，2默认为私有空间配置
  @PrimaryColumn({
    name: 'id',
    type: 'integer'
  })
  id: number;

  //公有还是私有空间，值为public、private
  @Column({
    name: 'public_or_private',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true
  })
  public_or_private: string;


  //此空间下所有文件都存储于这个目录里,与虚拟目录无关
  @Column({
    name: 'name',
    type: 'varchar',
    length: 20,
    nullable: false
  })
  name: string;

  //token密钥
  @Column({
    name: 'token_secret_key',
    type: 'varchar',
    length: 250,
    nullable: true
  })
  token_secret_key: string;

  //token过期时间，单位秒
  @Column({
    name: 'token_expire',
    type: 'integer',
    nullable: true
  })
  token_expire: number;

  /* 
  这里lazy:false的意思不是每个Bucket查询出来的时候就会包含image_config
  它的意思只是在于获取的属性是否是Promise，而要查询出来的Bucket包含image_config，必须使用find({relation:xxxx})
  */
  @OneToOne(type => ImageConfig,imageConfig=>imageConfig.bucket,{
    cascadeInsert: true,
    cascadeUpdate: true,
    cascadeRemove: true,
    lazy: false
  })
  image_config: ImageConfig;

  @OneToOne(type =>AudioConfig,audioConfig=>audioConfig.bucket,{
    cascadeInsert: true,
    cascadeUpdate: true,
    cascadeRemove: true,
    lazy: false
  })
  audio_config: AudioConfig;

  @OneToOne(type => VideoConfig,videoConfig=>videoConfig.bucket,{
    cascadeInsert: true,
    cascadeUpdate: true,
    cascadeRemove: true,
    lazy: false
  })
  video_config: VideoConfig;


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

  @OneToMany(type => Audio, audio=> audio.bucket, {
    cascadeInsert: true,
    cascadeUpdate: true,
    lazy: true
  })
  audios?: Promise<Audio[]>;

  @OneToMany(type => Video, video => video.bucket, {
    cascadeInsert: true,
    cascadeUpdate: true,
    lazy: true
  })
  videos?:Promise<Video[]>;

  @OneToMany(type => Document, document => document.bucket, {
    cascadeInsert: true,
    cascadeUpdate: true,
    lazy: true
  })
  documents?:Promise<Document[]>;
}