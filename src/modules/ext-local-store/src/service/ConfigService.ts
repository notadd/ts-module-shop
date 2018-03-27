import { EnableImageWatermarkConfig } from '../interface/config/EnableImageWatermarkConfig';
import { Repository, getManager, getConnection, Connection } from 'typeorm';
import { VideoFormatConfig } from '../interface/config/VideoFormatConfig';
import { AudioFormatConfig } from '../interface/config/AudioFormatConfig';
import { ImageFormatConfig } from '../interface/config/ImageFormatConfig';
import { Component, Inject, HttpException } from '@nestjs/common';
import { BucketConfig } from '../interface/config/BucketConfig';
import { ImageConfig } from '../model/ImageConfig.entity';
import { AudioConfig } from '../model/AudioConfig.entity';
import { VideoConfig } from '../model/VideoConfig.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {RestfulUtil} from "../util/RestfulUtil";
import { Bucket } from '../model/Bucket.entity';
import { Image } from '../model/Image.entity';
import { FileUtil } from '../util/FileUtil';
import { AuthUtil } from '../util/AuthUtil';
import * as  crypto from 'crypto';


/* 配置服务组件，包含了保存公有空间、私有空间、格式、水印等配置项的功能
   还可以获取公有、私有配置  
*/
@Component()
export class ConfigService {

  constructor(
    @Inject(FileUtil) private readonly fileUtil: FileUtil,
    @Inject(RestfulUtil) private readonly restfulUtil: RestfulUtil,
    @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
    @InjectRepository(Bucket) private readonly bucketRepository: Repository<Bucket>,
    @InjectRepository(ImageConfig) private readonly imageConfigRepository: Repository<ImageConfig>,
    @InjectRepository(AudioConfig) private readonly audioConfigRepository: Repository<AudioConfig>,
    @InjectRepository(VideoConfig) private readonly videoConfigRepository: Repository<VideoConfig>
  ) { }

  async saveBucketConfig(body: BucketConfig): Promise<Bucket> {
    let exist: Bucket
    let newBucket: Bucket = this.bucketRepository.create({
      name: body.name,
      operator: body.operator,
      password: crypto.createHash('md5').update(body.password).digest('hex'),
      directory: body.directory,
      base_url: body.base_url,
      request_expire: body.request_expire
    })
    if (body.isPublic) {
      exist = await this.bucketRepository.findOneById(1)
    } else {
      exist = await this.bucketRepository.findOneById(2)
      newBucket.token_expire = body.token_expire
      newBucket.token_secret_key = body.token_secret_key
    }
    if (exist) {
      try {
        await this.bucketRepository.updateById(exist.id, newBucket)
      } catch (err) {
        throw new HttpException('空间配置更新失败' + err.toString(), 403)
      }
      return newBucket
    }
    let audio_config = new AudioConfig()
    let video_config = new VideoConfig()
    let image_config = new ImageConfig()
    if (body.isPublic) {
      newBucket.id = 1
      newBucket.public_or_private = 'public'
    } else {
      newBucket.id = 2
      newBucket.public_or_private = 'private'
    }
    audio_config.id = newBucket.id
    video_config.id = newBucket.id
    image_config.id = newBucket.id
    newBucket.audio_config = audio_config
    newBucket.video_config = video_config
    newBucket.image_config = image_config
    try {
      await this.bucketRepository.save(newBucket)
    } catch (err) {
      throw new HttpException('空间保存失败' + err.toString(), 403)
    }
    return newBucket
  }


  async saveImageFormatConfig(body: ImageFormatConfig): Promise<any> {
    let { format } = body
    format = format.toLowerCase()
    if (format != 'raw' && format != 'webp_damage' && format != 'webp_undamage') {
      throw new HttpException('图片保存格式不正确', 400)
    }
    let buckets: Bucket[] = await this.bucketRepository.find({ relations: ["image_config"] })
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    try {
      for (let i = 0; i < buckets.length; i++) {
        await this.imageConfigRepository.updateById(buckets[i].image_config.id, { format })
      }
    } catch (err) {
      throw new HttpException('图片保存格式更新失败' + err.toString(), 403)
    }
    return
  }



  async saveEnableImageWatermarkConfig(body: EnableImageWatermarkConfig): Promise<void> {
    let buckets: Bucket[] = await this.bucketRepository.find({ relations: ["image_config"] })
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    let watermark_enable: number
    if (body.enable) {
      watermark_enable = 1
    } else {
      watermark_enable = 0
    }
    try {
      for (let i = 0; i < buckets.length; i++) {
        await this.imageConfigRepository.updateById(buckets[i].image_config.id, { watermark_enable })
      }
    } catch (err) {
      throw new HttpException('水印启用保存失败' + err.toString(), 403)
    }
  }

  async saveImageWatermarkConfig(file: any, obj: any): Promise<void> {
    let buckets: Bucket[] = await this.bucketRepository.find({ relations: ["image_config"] })
    let type = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    let buffer: Buffer = await this.fileUtil.read(file.path)
    let md5 = crypto.createHash('md5').update(buffer).digest('hex')
    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i].image_config.format === 'webp_damage' || buckets[i].image_config.format === 'webp_undamage') {
        type = 'webp'
      }
      let image: Image = new Image()
      //这里有坑，如果之前使用了await bucket.images，那么这个bucket的性质会改变，即便这样关联，最后image中仍旧没有bucketId值
      image.bucket = buckets[i]
      image.raw_name = file.name
      //图片文件名为md5_时间戳
      image.name = md5 + '_' + (+new Date())
      image.type = type
      image.status = 'post'
      let { width, height, frames } = await this.restfulUtil.uploadFile(buckets[i], image, file, null)
      let { file_size, file_md5 } = await this.restfulUtil.getFileInfo(buckets[i], image)
      image.width = width
      image.height = height
      image.frames = frames
      image.size = file_size
      image.md5 = file_md5
      try {
        await this.imageRepository.save(image)
      } catch (err) {
        throw new HttpException('水印图片保存失败' + err.toString(), 403)
      }
      try {
        await this.imageConfigRepository.updateById(buckets[i].image_config.id, {
          watermark_save_key: '/' + buckets[i].directory + '/' + image.name + '.' + image.type,
          watermark_gravity: obj.gravity,
          watermark_opacity: obj.opacity,
          watermark_ws: obj.ws,
          watermark_x: obj.x,
          watermark_y: obj.y
        })
      } catch (err) {
        throw new HttpException('水印配置更新失败' + err.toString(), 403)
      }
    }
    return
  }

  async saveAudioFormatConfig(body: AudioFormatConfig): Promise<void> {
    let { format } = body
    format = format.toLowerCase()
    if (format != 'raw' && format != 'mp3' && format != 'aac') {
      throw new HttpException('音频保存格式不正确', 400)
    }
    let buckets: Bucket[] = await this.bucketRepository.find({ relations: ["audio_config"] })
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    try {
      for (let i = 0; i < buckets.length; i++) {
        await this.audioConfigRepository.updateById(buckets[i].audio_config.id, { format })
      }
    } catch (err) {
      throw new HttpException('音频保存格式更新失败' + err.toString(), 403)
    }
  }

  async saveVideoFormatConfig(body: VideoFormatConfig): Promise<void> {
    let { format, resolution } = body
    format = format.toLowerCase()
    if (format != 'raw' && format != 'vp9' && format != 'h264' && format != 'h265') {
      throw new HttpException('视频编码格式不正确', 400)
    }
    resolution = resolution.toLowerCase()
    if (resolution != 'raw' && resolution != 'p1080' && resolution != 'p720' && resolution != 'p480') {
      throw new HttpException('视频分辨率格式不正确', 400)
    }

    let buckets: Bucket[] = await this.bucketRepository.find({ relations: ["video_config"] })
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    try {
      for (let i = 0; i < buckets.length; i++) {
        await this.videoConfigRepository.updateById(buckets[i].video_config.id, { format, resolution })
      }
    } catch (err) {
      throw new HttpException('视频保存格式更新失败' + err.toString(), 403)
    }
    return
  }
}
