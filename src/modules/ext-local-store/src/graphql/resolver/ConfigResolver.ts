import { Component, UseGuards, UseFilters, HttpException, Inject, UseInterceptors } from '@nestjs/common';
import { EnableImageWatermark } from '../../interface/config/EnableImageWatermark';
import { ExceptionInterceptor } from '../../interceptor/ExceptionInterceptor';
import { LocalExceptionFilter } from '../../exception/LocalExceptionFilter';
import { ImageWatermark } from '../../interface/config/ImageWatermark';
import { BucketConfig } from '../../interface/config/BucketConfig';
import { BucketsData } from '../../interface/config/BucketsData';
import { ImageFormat } from '../../interface/config/ImageFormat';
import { AudioFormat } from '../../interface/config/AudioFormat';
import { VideoFormat } from '../../interface/config/VideoFormat';
import { UploadFile } from '../../interface/file/UploadFile';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { ConfigService } from '../../service/ConfigService';
import { IncomingMessage, IncomingHttpHeaders } from 'http';
import { CommonData } from '../../interface/Common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bucket } from '../../model/Bucket.entity';
import { KindUtil } from '../../util/KindUtil';
import { FileUtil } from '../../util/FileUtil';
import { Repository } from 'typeorm';



/* 本地存储配置的resolver */
@Resolver('Config')
@UseInterceptors(ExceptionInterceptor)
export class ConfigResolver {

    //图片水印方位的集合，九宫格
    private readonly gravity: Set<string>
    private readonly image_format: Set<String>
    private readonly audio_format: Set<String>
    private readonly video_format: Set<String>
    private readonly video_resolution: Set<String>

    constructor(
        @Inject(FileUtil) private readonly fileUtil: FileUtil,
        @Inject(KindUtil) private readonly kindUtil: KindUtil,
        @Inject(ConfigService) private readonly configService: ConfigService,
        @InjectRepository(Bucket) private readonly bucketRepository: Repository<Bucket>
    ) {
        this.image_format = new Set(['raw', 'webp_damage', 'webp_undamage'])
        this.audio_format = new Set(['raw', 'mp3', 'aac'])
        this.video_format = new Set(['raw', 'vp9', 'h264', 'h265'])
        this.video_resolution = new Set(['raw', 'p1080', 'p720', 'p480'])
        this.gravity = new Set(['northwest', 'north', 'northeast', 'west', 'center', 'east', 'southwest', 'south', 'southeast'])
    }

    /* 空间配置的resolver，与云存储不同，只配置空间名即可，空间名即是store目录下的空间目录名，私有空间要配置token超时与密钥 */
    @Mutation('bucket')
    async bucket(req: IncomingMessage, body: BucketConfig): Promise<CommonData> {
        let { isPublic, name, token_expire, token_secret_key } = body
        //验证参数存在
        if (isPublic === undefined || isPublic === null || !name) {
            throw new HttpException('缺少参数', 400)
        }
        //验证参数正确与否
        if (isPublic !== true && isPublic !== false) {
            throw new HttpException('isPublic参数不正确', 400)
        }
        if (!isPublic && (!token_expire || !token_secret_key)) {
            throw new HttpException('缺少参数', 400)
        }
        if (!isPublic && (token_expire < 0 || token_expire > 1800)) {
            throw new HttpException('token超时不正确', 400)
        }
        //进行保存,如果存在就更新
        await this.configService.saveBucketConfig(body)
        return { code: 200, message: '空间配置保存成功' }
    }

    /* 图片保存格式配置*/
    @Mutation('imageFormat')
    async imageFormat(req: IncomingMessage, body: ImageFormat): Promise<CommonData> {
        let format: string = body.format
        //验证参数
        if (format == undefined || format.length == 0) {
            throw new HttpException('缺少参数', 400)
        }
        if (!this.image_format.has(format)) {
            throw new HttpException('保存格式不正确', 400)
        }
        //保存格式
        await this.configService.saveImageFormat(body)
        return { code: 200, message: "图片保存格式配置保存成功" }
    }

    /* 图片水印启用配置 */
    @Mutation('enableImageWatermark')
    async  enableImageWatermark(req: IncomingMessage, body: EnableImageWatermark): Promise<CommonData> {
        //验证参数
        let enable: boolean = body.enable
        //验证参数存在
        if (enable === null || enable === undefined) {
            throw new HttpException('缺少参数', 400)
        }
        //验证参数正确
        if (enable !== true && enable !== false) {
            throw new HttpException('参数enable错误', 400)
        }
        //保存配置
        await this.configService.saveEnableImageWatermark(body)
        return { code: 200, message: '图片水印启用配置保存成功' }
    }

    /* 图片水印配置,其中水印图片以base64编码传输 */
    @Mutation('imageWatermark')
    async  imageWatermark(req: IncomingMessage, body: ImageWatermark): Promise<CommonData> {
        //水印图片临时保存路径
        let temp_path: string
        try {
            let { name, gravity, opacity, x, y, ws } = body
            //验证参数存在，其中数字为0也可以
            if (!name || !body.base64 || !gravity || (opacity !== 0 && !opacity) || (x !== 0 && !x) || (y !== 0 && !y) || (ws !== 0 && !ws)) {
                throw new HttpException('缺少参数', 400)
            }
            //验证参数正确
            if (!this.gravity.has(gravity)) {
                throw new HttpException('不允许的水印图片位置', 400)
            }
            if (!Number.isInteger(x)) {
                throw new HttpException('x偏移不是整数', 400)
            }
            if (!Number.isInteger(y)) {
                throw new HttpException('y偏移不是整数', 400)
            }
            if (!Number.isInteger(opacity)) {
                throw new HttpException('透明度不是整数', 400)
            } else if (opacity <= 0) {
                throw new HttpException('透明度小于0', 400)
            } else if (opacity > 100) {
                throw new HttpException('透明度大于100', 400)
            } else {

            }
            if (!Number.isInteger(ws)) {
                throw new HttpException('短边自适应比例不是整数', 400)
            } else if (ws <= 0) {
                throw new HttpException('短边自适应比例不大于0', 400)
            } else {
                //暂定短边自适应比例可以大于100
            }
            //保存图片的base64编码为文件，保存目录为当前目录下
            temp_path = __dirname + '/' + name
            await this.fileUtil.write(temp_path, Buffer.from(body.base64, 'base64'))
            //删除base64字符串，太大了
            delete body.base64
            //上传文件对象，存储了上传文件名、临时保存路径
            let file: UploadFile = {
                name: name,
                path: temp_path
            }
            if (!this.kindUtil.isImage(file.name.substr(file.name.lastIndexOf('.') + 1))) {
                throw new HttpException('不允许的水印图片类型', 400)
            }
            //保存后台水印配置
            await this.configService.saveImageWatermark(file, body)
        } catch (err) {
            throw err
        } finally {
            //删除保存的临时水印图片，这里有可能没有到保存水印图片这一步就异常了
            //resolver级别生成的临时水印图片，也应该在这个级别删除，不应该留到Service中
            if (temp_path) {
                await this.fileUtil.deleteIfExist(temp_path)
            }
        }
        return { code: 200, message: '图片水印配置成功' }
    }

    /* 音频保存格式配置*/
    @Mutation('audioFormat')
    async  audioFormat(req: IncomingMessage, body: AudioFormat): Promise<CommonData> {
        let format: string = body.format
        if (!format) {
            throw new HttpException('缺少参数', 400)
        }
        if (format != 'raw' && format != 'mp3' && format != 'aac') {
            throw new HttpException('音频保存格式不正确', 400)
        }
        //保存格式到数据库
        await this.configService.saveAudioFormat(body)
        return { code: 200, message: "音频保存格式配置保存成功" }
    }

    /* 视频保存配置*/
    @Mutation('videoFormat')
    async videoFormat(req: IncomingMessage, body: VideoFormat): Promise<CommonData> {
        //视频编码、分辨率
        let { format, resolution } = body
        if (!format || !resolution) {
            throw new HttpException('缺少参数', 400)
        }
        if (format != 'raw' && format != 'vp9' && format != 'h264' && format != 'h265') {
            throw new HttpException('编码格式不正确', 400)
        }
        if (resolution != 'raw' && resolution != 'p1080' && resolution != 'p720' && resolution != 'p480') {
            throw new HttpException('分辨率格式不正确', 400)
        }
        //保存格式到数据库
        await this.configService.saveVideoFormat(body)
        return { code: 200, message: "视频保存格式配置保存成功" }
    }

    /* 获取所有空间信息字段 */
    @Query('buckets')
    async buckets(req: IncomingMessage): Promise<BucketsData> {
        //查询出所有空间的三个字段，其他字段保密
        let buckets: Bucket[] = await this.bucketRepository.createQueryBuilder('bucket')
            .select(['bucket.id', 'bucket.public_or_private', 'bucket.name'])
            .getMany()
        if (buckets.length !== 2) {
            throw new HttpException('空间配置不存在', 401)
        }
        return { code: 200, message: '获取空间配置成功', buckets }
    }
}