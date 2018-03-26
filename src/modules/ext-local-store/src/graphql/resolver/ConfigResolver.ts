import { EnableImageWatermarkConfig } from '../../interface/config/EnableImageWatermarkConfig';
import { ImageWatermarkConfig } from '../../interface/config/ImageWatermarkConfig';
import { ExceptionInterceptor } from '../../interceptor/ExceptionInterceptor';
import { AudioFormatConfig } from '../../interface/config/AudioFormatConfig';
import { VideoFormatConfig } from '../../interface/config/VideoFormatConfig';
import { Query, Resolver, ResolveProperty, Mutation } from '@nestjs/graphql';
import { ImageFormatConfig } from '../../interface/config/ImageFormatConfig';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { BucketConfig } from '../../interface/config/BucketConfig';
import { ConfigService } from '../../service/ConfigService';
import { FileService } from '../../service/FileService';
import { Document } from '../../model/Document.entity';
import { RestfulUtil } from '../../util/RestfulUtil';
import { InjectRepository } from '@nestjs/typeorm';
import { Bucket } from '../../model/Bucket.entity';
import { Audio } from '../../model/Audio.entity';
import { Video } from '../../model/Video.entity';
import { Image } from '../../model/Image.entity';
import { File } from '../../model/File.entity';
import { FileUtil } from '../../util/FileUtil';
import { KindUtil } from '../../util/KindUtil';
import { AuthUtil } from '../../util/AuthUtil';
import { Data } from '../../interface/Data';
import * as formidable from 'formidable';
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
import { userInfo } from 'os';

/* 空间基本配置的resolver */
@Resolver('Config')
@UseInterceptors(ExceptionInterceptor)
export class ConfigResolver {

  private readonly gravity: Set<string> = new Set(['northwest', 'north', 'northeast', 'west', 'center', 'east', 'southwest', 'south', 'southeast'])
  constructor(
    @Inject(FileUtil) private readonly fileUtil: FileUtil,
    @Inject(KindUtil) private readonly kindUtil: KindUtil,
    @Inject(RestfulUtil) private readonly restfulUtil: RestfulUtil,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @InjectRepository(Bucket) private readonly bucketRepository: Repository<Bucket>
  ) { }

  /* 配置空间基本信息 */
  @Mutation('bucket')
  async bucket(req: IncomingMessage, body: BucketConfig): Promise<Data> {
    let { isPublic, name, operator, password, directory, base_url, request_expire } = body;
    if (isPublic === undefined || !name || !operator || !password || !directory || !base_url || !request_expire) {
      throw new HttpException('缺少参数', 400)
    }
    if (isPublic !== true && isPublic !== false && isPublic !== 'true' && isPublic !== 'false') {
      throw new HttpException('isPublic参数不正确', 400)
    }
    if (!Number.isInteger(body.request_expire)) {
      throw new HttpException('请求超时参数为非整数', 400)
    } else if (body.request_expire < 0) {
      throw new HttpException('请求超时参数小于0', 400)
    } else if (body.request_expire > 1800) {
      throw new HttpException('请求超时参数大于1800', 400)
    }
    if (!isPublic) {
      if (!Number.isInteger(body.token_expire)) {
        throw new HttpException('token超时参数为非整数', 400)
      } else if (body.token_expire < 0) {
        throw new HttpException('token超时参数小于0', 400)
      } else if (body.token_expire > 1800) {
        throw new HttpException('token超时参数大于1800', 400)
      }
    }
    //保存配置，如果已存在就更新它
    let bucket: Bucket = await this.configService.saveBucketConfig(body)
    await this.restfulUtil.createDirectory(bucket)
    return { code: 200, message: '空间配置成功' }
  }

  /* 图片保存格式配置，目前公有空间、私有空间采用一个保存格式，会在两个配置信息中各保存一次 */
  @Mutation('imageFormat')
  async  imageFormat(req: IncomingMessage, body: ImageFormatConfig): Promise<Data> {
    let format = body.format
    if (format == undefined || format.length == 0) {
      throw new HttpException('缺少参数', 400)
    }
    //保存格式
    await this.configService.saveImageFormatConfig(body)
    return { code: 200, message: "图片保存格式配置成功" }
  }


  @Mutation('enableImageWatermark')
  async  enableImageWatermark(req: IncomingMessage, body: EnableImageWatermarkConfig): Promise<Data> {
    //这里在schema中定义为枚举值，接受到参数为string
    let { enable } = body
    if (enable === null || enable === undefined) {
      throw new HttpException('缺少参数', 400)
    }
    //enable参数错误
    if (enable !== true && enable !== false) {
      throw new HttpException('参数错误', 400)
    }
    await this.configService.saveEnableImageWatermarkConfig(body)
    return { code: 200, message: '启用图片水印成功' }
  }

  /* 保存水印配置，目前两个空间采用同一个图片水印，忽略文字水印、忽略多水印 
     水印图片必须与被加水印图片在同一个服务名下，所以需要在两个空间下各保存一次
     为了向前端提供统一接口，这里采用将水印图片上传到服务器，由服务发起restful上传请求的方式
     如果客户端上传，客户端调用会比较繁杂
  */
  @Mutation('imageWatermark')
  async  imageWatermarkConfig(req: IncomingMessage, body: ImageWatermarkConfig): Promise<Data> {
    let tempPath = __dirname + '/' + body.name
    try {
      let { name, base64, gravity, opacity, x, y, ws } = body
      await this.fileUtil.write(tempPath, Buffer.from(base64, 'base64'))
      let obj: any = {}
      let file: any = {}
      obj.x = x
      obj.y = y
      obj.opacity = opacity
      obj.ws = ws
      obj.gravity = gravity
      file.name = name
      file.path = tempPath
      if (!this.gravity.has(obj.gravity)) {
        throw new HttpException('不允许的水印图片位置', 400)
      }
      if (!Number.isInteger(obj.x)) {
        throw new HttpException('x偏移不是整数', 400)
      }
      if (!Number.isInteger(obj.y)) {
        throw new HttpException('y偏移不是整数', 400)
      }
      if (!Number.isInteger(obj.opacity)) {
        throw new HttpException('透明度不是整数', 400)
      } else if (obj.opacity <= 0) {
        throw new HttpException('透明度不大于0', 400)
      } else if (obj.opacity > 100) {
        throw new HttpException('透明度大于100', 400)
      } else {
      }
      if (!Number.isInteger(obj.ws)) {
        throw new HttpException('短边自适应比例不是整数', 400)
      } else if (obj.ws <= 0) {
        throw new HttpException('短边自适应比例不大于0', 400)
      } else {
        //暂定短边自适应比例可以大于100
      }
      if (!this.kindUtil.isImage(file.name.substr(file.name.lastIndexOf('.') + 1))) {
        throw new HttpException('不允许的水印图片类型', 400)
      }
      //保存后台水印配置
      await this.configService.saveImageWatermarkConfig(file, obj)
    } catch (err) {
      throw err
    } finally {
      await this.fileUtil.delete(tempPath)
    }
    return { code: 200, message: '图片水印配置成功' }
  }

  /* 音频保存格式配置，目前公有空间、私有空间采用一个保存格式，会在两个配置信息中各保存一次 */
  @Mutation('audioFormat')
  async  audioFormat(req: IncomingMessage, body: AudioFormatConfig): Promise<Data> {
    let format = body.format
    if (!format) {
      throw new HttpException('缺少参数', 400)
    }
    //保存公有空间格式
    await this.configService.saveAudioFormatConfig(body)
    return { code: 200, message: "音频保存格式配置成功" }
  }

  /* 视频保存配置，目前公有空间、私有空间采用一个保存格式，会在两个配置信息中各保存一次 */
  @Mutation('videoFormat')
  async videoFormat(req: IncomingMessage, body: VideoFormatConfig): Promise<Data> {
    let { format, resolution } = body
    if (!format || !resolution) {
      throw new HttpException('缺少参数', 400)
    }
    //保存公有空间格式
    await this.configService.saveVideoFormatConfig(body)
    return { code: 200, message: "视频保存格式配置成功" }
  }

  /* 获取所有空间信息字段 */
  @Query('buckets')
  async buckets(): Promise<Data & { buckets: Bucket[] }> {
    let buckets: Bucket[] = await this.bucketRepository.createQueryBuilder('bucket')
      .select(['bucket.id', 'bucket.public_or_private', 'bucket.name'])
      .getMany()
    if (buckets.length !== 2) {
      throw new HttpException('空间配置不存在', 401)
    }
    return { code: 200, message: '获取空间配置成功', buckets }
  }
}