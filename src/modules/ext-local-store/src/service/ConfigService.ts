import { EnableImageWatermark } from '../interface/config/EnableImageWatermark';
import { ImagePostProcessInfo } from '../interface/file/ImageProcessInfo';
import { Component, HttpException ,Inject} from '@nestjs/common';
import { BucketConfig } from '../interface/config/BucketConfig';
import { ImageMetadata } from '../interface/file/ImageMetadata';
import { ImageFormat } from '../interface/config/ImageFormat';
import { AudioFormat } from '../interface/config/AudioFormat';
import { VideoFormat } from '../interface/config/VideoFormat';
import { ImageProcessUtil } from '../util/ImageProcessUtil';
import { ImageConfig } from '../model/ImageConfig.entity';
import { AudioConfig } from '../model/AudioConfig.entity';
import { VideoConfig } from '../model/VideoConfig.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Bucket } from '../model/Bucket.entity';
import { Image } from '../model/Image.entity';
import { FileUtil } from '../util/FileUtil';
import { Repository } from 'typeorm';
import * as  crypto from 'crypto';
import * as  path from 'path';


@Component()
export class ConfigService {

  constructor(
    @Inject(FileUtil) private readonly fileUtil: FileUtil,
    @Inject(ImageProcessUtil) private readonly imageProcessUtil: ImageProcessUtil,
    @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
    @InjectRepository(Bucket) private readonly bucketRepository: Repository<Bucket>,
    @InjectRepository(ImageConfig) private readonly imageConfigRepository: Repository<ImageConfig>,
    @InjectRepository(AudioConfig) private readonly audioConfigRepository: Repository<AudioConfig>,
    @InjectRepository(VideoConfig) private readonly videoConfigRepository: Repository<VideoConfig>
  ) { }

  async saveBucketConfig(body: BucketConfig): Promise<void> {
    let exist: Bucket
    let newBucket: any = {
      name: body.name,
    }
    let directory_path = path.resolve(__dirname, '../', 'store', body.name)
    if (body.isPublic) {
      exist = await this.bucketRepository.findOneById(1)
    } else {
      exist = await this.bucketRepository.findOneById(2)
      newBucket.token_expire = +body.token_expire
      newBucket.token_secret_key = body.token_secret_key
    }
    if (exist) {
      try {
        await this.bucketRepository.updateById(exist.id, newBucket)
        //创建新目录，暂定不删除旧目录,只是新建这次配置的目录
        if (!this.fileUtil.exist(directory_path)) {
          await this.fileUtil.mkdir(directory_path)
        }
      } catch (err) {
        throw new HttpException('空间配置更新失败' + err.toString(), 410)
      }
      return
    }
    let bucket: Bucket = new Bucket()
    let audio_config: AudioConfig = new AudioConfig()
    let video_config: VideoConfig = new VideoConfig()
    let image_config: ImageConfig = new ImageConfig()
    if (body.isPublic) {
      bucket.id = 1
      bucket.public_or_private = 'public'
    } else {
      bucket.id = 2
      bucket.public_or_private = 'private'
      bucket.token_expire = +body.token_expire
      bucket.token_secret_key = body.token_secret_key
    }
    bucket.name = body.name
    audio_config.id = bucket.id
    video_config.id = bucket.id
    image_config.id = bucket.id
    bucket.audio_config = audio_config
    bucket.video_config = video_config
    bucket.image_config = image_config
    try {
      await this.bucketRepository.save(bucket)
      if (!this.fileUtil.exist(directory_path)) {
        await this.fileUtil.mkdir(directory_path)
      }
    } catch (err) {
      throw new HttpException('空间保存失败' + err.toString(), 410)
    }
  }

  async saveImageFormat(body: ImageFormat): Promise<void> {
    let { format } = body
    format = format.toLowerCase()
    let buckets: Bucket[] = await this.bucketRepository.find({ relations: ["image_config"] })
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    try {
      await buckets.forEach(async (bucket) => {
        await this.imageConfigRepository.updateById(bucket.image_config.id, { format })
      })
    } catch (err) {
      throw new HttpException('图片保存格式更新失败' + err.toString(), 410)
    }
  }

  async saveEnableImageWatermark(body: EnableImageWatermark): Promise<void> {
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
      await buckets.forEach(async (bucket) => {
        await this.imageConfigRepository.updateById(bucket.image_config.id, { watermark_enable })
      })
    } catch (err) {
      throw new HttpException('水印启用更新失败' + err.toString(), 410)
    }
  }

  async saveImageWatermark(file: any, obj: any): Promise<void> {
    let buckets: Bucket[] = await this.bucketRepository.find({ relations: ["image_config"] })
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    for (let i = 0; i < buckets.length; i++) {
      let metadata: ImageMetadata
      //根据format设置处理后文件类型
      let format = buckets[i].image_config.format || 'raw'
      //根据不同的图片保存类型，处理并且存储图片，返回处理后元数据
      if (format === 'raw') {
        metadata = await this.imageProcessUtil.processAndStore(file.path, buckets[i], { strip: true, watermark: false })
      } else if (format === 'webp_damage') {
        metadata = await this.imageProcessUtil.processAndStore(file.path, buckets[i], { format: 'webp', strip: true, watermark: false })
      } else if (format === 'webp_undamage') {
        metadata = await this.imageProcessUtil.processAndStore(file.path, buckets[i], { format: 'webp', lossless: true, strip: true, watermark: false })
      }
      let image: Image = new Image()
      image.bucket = buckets[i]
      image.raw_name = file.name
      image.name = metadata.name
      image.type = metadata.format
      image.width = metadata.width
      image.height = metadata.height
      image.size = metadata.size
      let isExist: Image = await this.imageRepository.findOne({ name: metadata.name, bucketId: buckets[i].id })
      //只有指定路径图片不存在时才会保存
      if (!isExist) {
        try {
          await this.imageRepository.save(image)
        } catch (err) {
          //保存图片出现错误，要删除存储图片
          await this.fileUtil.delete(path.resolve(__dirname, '../', 'store', buckets[i].name, image.name + '.' + image.type))
          throw new HttpException('水印图片保存失败' + err.toString(), 410)
        }
      }
      //更新图片配置，这里的水印图片路径为图片的绝对路径
      //不管图片是否已经存在，图片配置都需要更新
      try {
        await this.imageConfigRepository.updateById(buckets[i].image_config.id, {
          //水印路径为相对路径
          watermark_save_key: '/store/' + buckets[i].name + '/' + image.name + '.' + image.type,
          watermark_gravity: obj.gravity,
          watermark_opacity: obj.opacity,
          watermark_ws: obj.ws,
          watermark_x: obj.x,
          watermark_y: obj.y
        })
      } catch (err) {
        throw new HttpException('图片水印更新失败' + err.toString(), 410)
      }
    }
    //删除临时文件
    await this.fileUtil.delete(file.path)
  }

  async saveAudioFormat(body: AudioFormat): Promise<any> {
    let { format } = body
    format = format.toLowerCase()
    let buckets: Bucket[] = await this.bucketRepository.find({ relations: ["audio_config"] })
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    try {
      await buckets.forEach(async (bucket) => {
        await this.audioConfigRepository.updateById(bucket.audio_config.id, { format })
      })
    } catch (err) {
      throw new HttpException('音频保存格式更新失败' + err.toString(), 410)
    }
  }

  async saveVideoFormat(body: VideoFormat): Promise<any> {
    let { format, resolution } = body
    format = format.toLowerCase()
    resolution = resolution.toLowerCase()
    let buckets: Bucket[] = await this.bucketRepository.find({ relations: ["video_config"] })
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    try {
      await buckets.forEach(async (bucket) => {
        await this.videoConfigRepository.updateById(bucket.video_config.id, { format, resolution })
      })
    } catch (err) {
      throw new HttpException('视频保存格式更新失败' + err.toString(), 410)
    }
  }
}