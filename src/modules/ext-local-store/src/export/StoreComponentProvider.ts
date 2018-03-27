import { ImagePostProcessInfo, ImagePreProcessInfo } from '../interface/file/ImageProcessInfo';
import { HttpException, Component, Inject } from '@nestjs/common';
import { ProcessStringUtil } from '../util/ProcessStringUtil';
import { FileService } from '../service/FileService';
import { Document } from '../model/Document.entity';
import { RestfulUtil} from "../util/RestfulUtil";
import { Repository, Connection } from 'typeorm';
import { Bucket } from '../model/Bucket.entity';
import { Video } from '../model/Video.entity';
import { Audio } from '../model/Audio.entity';
import { Image } from '../model/Image.entity';
import { File } from '../model/File.entity';
import { AuthUtil } from '../util/AuthUtil';
import { KindUtil } from '../util/KindUtil';
import { FileUtil } from '../util/FileUtil';
import * as crypto from 'crypto';
import * as path from 'path';
import * as os from 'os';


export class StoreComponent {

    constructor(
        @Inject(KindUtil) private readonly kindUtil: KindUtil,
        @Inject(FileUtil) private readonly fileUtil: FileUtil,
        @Inject(AuthUtil) private readonly authUtil: AuthUtil,
        @Inject(RestfulUtil) private readonly resufulUtil: RestfulUtil,
        @Inject(FileService) private readonly fileService: FileService,
        @Inject(ProcessStringUtil) private readonly processStringUtil: ProcessStringUtil,
        @Inject('UpyunModule.ImageRepository') private readonly imageRepository: Repository<Image>,
        @Inject('UpyunModule.BucketRepository') private readonly bucketRepository: Repository<Bucket>
    ) { }

    async delete(bucketName: string, name: string, type: string): Promise<void> {
        //验证参数
        if (!bucketName || !name || !type) {
            throw new HttpException('缺少参数', 400)
        }
        let bucket: Bucket = await this.bucketRepository.findOne({ name: bucketName })
        if (!bucket) {
            throw new HttpException('指定空间' + bucketName + '不存在', 401)
        }
        //根据文件种类，查找、删除数据库
        let file: Image | Audio | Video | Document | File
        let kind = this.kindUtil.getKind(type)
        if (kind === 'image') {
            file = await this.imageRepository.findOne({ name, bucketId: bucket.id })
            if (!file) {
                throw new HttpException('文件' + name + '不存在于数据库中', 404)
            }
            await this.imageRepository.deleteById(file.id)
        } else {
            //其他类型暂不支持
        }
        await this.resufulUtil.deleteFile(bucket, file)
        return
    }

    async upload(bucketName: string, rawName: string, base64: string, imagePreProcessInfo: ImagePreProcessInfo): Promise<{ bucketName: string, name: string, type: string }> {

        if (!bucketName || !rawName || !base64) {
            throw new HttpException('缺少参数', 400)
        }
        let bucket: Bucket = await this.bucketRepository.createQueryBuilder('bucket')
            .leftJoinAndSelect('bucket.image_config', 'image_config')
            .where('bucket.name = :name', { name: bucketName })
            .getOne()
        if (!bucket) {
            throw new HttpException('指定空间' + bucketName + '不存在', 401)
        }
        let buffer: Buffer = Buffer.from(base64, 'base64')
        let md5 = crypto.createHash('md5').update(buffer).digest('hex')
        let name = md5 + '_' + (+new Date())
        let tempPath = os.tmpdir + '/' + rawName
        await this.fileUtil.write(tempPath, buffer)
        let file: Image | Audio | Video | Document | File
        let uploadFile = { path: tempPath }
        let type: string = rawName.substring(rawName.lastIndexOf('.') + 1)
        if (bucket.image_config.format === 'webp_damage' || bucket.image_config.format === 'webp_undamage') {
            type = 'webp'
        }
        let kind: string = this.kindUtil.getKind(type)
        try {
            if (kind === 'image') {
                file = this.imageRepository.create({
                    bucket,
                    raw_name: rawName,
                    name,
                    type,
                    md5,
                    status: 'post'
                })
                let { width, height, frames } = await this.resufulUtil.uploadFile(bucket, file, uploadFile, imagePreProcessInfo)
                let { file_size, file_md5 } = await this.resufulUtil.getFileInfo(bucket, file)
                file = this.imageRepository.create({
                    bucket,
                    raw_name: rawName,
                    name,
                    type,
                    width,
                    height,
                    frames,
                    size: file_size,
                    md5: file_md5,
                    status: 'post'
                })
                await this.imageRepository.save(file)
            } else {
                //其他类型暂不支持
            }
        } catch (err) {
            throw err
        } finally {
            //如果中间过程抛出了异常，要保证删除临时图片
            await this.fileUtil.deleteIfExist(tempPath)
        }
        return { bucketName, name, type }
    }

    async getUrl(req: any, bucketName: string, name: string, type: string, imagePostProcessInfo: ImagePostProcessInfo): Promise<string> {
        //验证参数
        if (!bucketName || !name || !type) {
            throw new HttpException('缺少参数', 400)
        }
        let bucket: Bucket = await this.bucketRepository.createQueryBuilder('bucket')
            .leftJoinAndSelect('bucket.image_config', 'image_config')
            .where('bucket.name = :name', { name: bucketName })
            .getOne()
        if (!bucket) {
            throw new HttpException('指定空间' + bucketName + '不存在', 401)
        }
        let url: string
        //根据文件种类，查找、删除数据库
        let file: Image | Audio | Video | Document | File
        let kind = this.kindUtil.getKind(type)
        if (kind === 'image') {
            file = await this.imageRepository.findOne({ name, bucketId: bucket.id })
            if (!file) {
                throw new HttpException('指定图片' + name + '.' + type + '不存在', 404)
            }
        } else {
            //其他类型暂不支持
        }
        url = await this.fileService.makeUrl(bucket, file, { imagePostProcessInfo }, kind)
        return url
    }
}

export const StoreComponentProvider = {
    provide: 'StoreComponentToken',
    useFactory: (kindUtil: KindUtil, fileUtil: FileUtil, authUtil: AuthUtil, restfulUtil: RestfulUtil, fileService: FileService, processStringUtil: ProcessStringUtil, imageRepository: Repository<Image>, bucketRepository: Repository<Bucket>) => {
        return new StoreComponent(kindUtil, fileUtil, authUtil, restfulUtil, fileService, processStringUtil, imageRepository, bucketRepository)
    },
    inject: [KindUtil, FileUtil, AuthUtil, RestfulUtil, FileService, ProcessStringUtil, 'ImageRepository', 'BucketRepository']

}