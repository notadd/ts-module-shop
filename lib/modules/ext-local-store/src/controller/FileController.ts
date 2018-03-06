import { Controller, Get, Post, Request, Response, Body, Param, Headers, Query, UseFilters, UseGuards, HttpException, Inject } from '@nestjs/common';
import { ImagePostProcessInfo } from '../interface/file/ImageProcessInfo';
import { LocalExceptionFilter } from '../exception/LocalExceptionFilter';
import { DownloadParamGuard } from '../guard/DownloadParamGuard';
import { ImageMetadata } from '../interface/file/ImageMetadata';
import { UploadParamGuard } from '../guard/UploadParamGuard';
import { ImageProcessUtil } from '../util/ImageProcessUtil';
import { HeaderParam } from '../interface/file/HeaderParam';
import { UploadFile } from '../interface/file/UploadFile';
import { UploadForm } from '../interface/file/UploadForm';
import { QueryParam } from '../interface/file/QueryParam';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PathParam } from '../interface/file/PathParam';
import { FileService } from '../service/FileService';
import { CommonData } from '../interface/Common'
import { TokenUtil } from '../util/TokenUtil';
import { Document } from '../model/Document';
import { FileUtil } from '../util/FileUtil';
import { KindUtil } from '../util/KindUtil';
import * as  formidable from 'formidable';
import { Bucket } from '../model/Bucket';
import { Audio } from '../model/Audio';
import { Video } from '../model/Video';
import { Image } from '../model/Image';
import { File } from '../model/File';
import * as crypto from 'crypto';
import * as path from 'path';
import * as mime from 'mime';


/*文件控制器，包含了文件下载、上传、访问功能
  访问、下载在浏览器的默认效果不同，其中访问私有空间文件需要token
*/
@Controller('local/file')
@UseFilters(new LocalExceptionFilter())
export class FileController {

    constructor(
        @Inject(FileUtil) private readonly fileUtil: FileUtil,
        @Inject(KindUtil) private readonly kindUtil: KindUtil,
        @Inject(TokenUtil) private readonly tokenUtil: TokenUtil,
        @Inject(FileService) private readonly fileService: FileService,
        @Inject(ImageProcessUtil) private readonly imageProcessUtil: ImageProcessUtil,
        @Inject('LocalModule.FileRepository') private readonly fileRepository: Repository<File>,
        @Inject('LocalModule.ImageRepository') private readonly imageRepository: Repository<Image>,
        @Inject('LocalModule.BucketRepository') private readonly bucketRepository: Repository<Bucket>) {
    }

    /* 下载文件接口，文件路径在url中，文件存在直接返回，不存在返回错误码404 */
    @Get('/download')
    @UseGuards(DownloadParamGuard)
    async download( @Headers() headers: HeaderParam, @Response() res): Promise<any> {
        let { bucketName, fileName } = headers
        //文件绝对路径，这里并不查询数据库，直接从文件夹获取
        let realPath: string = path.resolve(__dirname, '../', 'store', bucketName, fileName)
        //文件不存在，返回404
        if (!this.fileUtil.exist(realPath)) {
            throw new HttpException('请求下载的文件不存在', 404)
        }
        //下载文件的buffer，不进行处理，返回原始文件
        let buffer: Buffer = await this.fileUtil.read(realPath)
        //文件类型响应头
        res.setHeader('Content-Type', mime.getType(fileName))
        //文件大小响应头
        res.setHeader('Content-Length', Buffer.byteLength(buffer))
        //下载响应头，不管浏览器支持不支持显示文件mime，都会直接弹出下载
        res.setHeader('Content-Disposition', 'attachment; filename=' + fileName)
        //发送文件buffer
        res.end(buffer)
        return
    }


    /* 上传文件接口，空间名、文件原名在路径中，其他上传信息：md5、图片处理字符串、标签字符串、文件密钥都与文件一起使用表单上传
       小bug，如果参数中出现了@Response装饰器，那么直接使用return返回不成功，需要使用res.end
    */
    @Post('/upload')
    @UseGuards(UploadParamGuard)
    async upload( @Body() body): Promise<CommonData> {
        let { uploadForm: obj, uploadFile: file } = body
        //这里使用trycatch块主要是为了不论抛出神码异常，上传的临时文件都会被删除，最后异常仍旧会被过滤器处理
        try {
            //这里需要将图片、音频、视频配置关联查找出来，后面保存文件预处理要使用
            let bucket: Bucket = await this.bucketRepository.createQueryBuilder("bucket")
                .leftJoinAndSelect("bucket.image_config", "image_config")
                .leftJoinAndSelect("bucket.audio_config", "audio_config")
                .leftJoinAndSelect("bucket.video_config", "video_config")
                .where("bucket.name = :name", { name: obj.bucketName })
                .getOne()
            if (!bucket) {
                throw new HttpException('指定空间' + obj.bucketName + '不存在', 401)
            }
            //上传文件的文件名必须与路径中文件名相同，路径中文件名是上传预处理时就确定好的
            if (file.name !== obj.rawName) {
                throw new HttpException('上传文件名' + file.name + '与请求头中文件名' + obj.fileName + '不符', 411)
            }
            let { imagePreProcessString, contentSecret, tagsString, md5 } = obj
            //对上传文件进行md5校验
            let buffer: Buffer = await this.fileUtil.read(file.path)
            if (!(crypto.createHash('md5').update(buffer).digest('hex') === md5)) {
                throw new HttpException('文件md5校验失败', 411)
            }
            //保存上传文件，对文件进行处理后保存在store目录下，将文件信息保存到数据库中
            await this.fileService.saveUploadFile(bucket, file, obj)
        } catch (err) {
            throw err
        } finally {
            await this.fileUtil.delete(file.path)
        }
        return {
            code: 200,
            message: '上传文件成功'
        }
    }

    /* 访问文件接口，文件路径在url中
       私有空间文件需要token，token与图片处理字符串都在查询字符串中
       文件存在且token正确，处理后返回，不存在返回错误 
       这个接口不需要Guard，因为如果缺少参数就找不到路由   
    */
    @Get('/visit/:bucketName/:fileName')
    async visit( @Param() param: PathParam, @Query() query: QueryParam, @Response() res, @Request() req): Promise<any> {
        let { bucketName, fileName } = param
        let { imagePostProcessString, token } = query
        //判断文件是否存在
        let realPath: string = path.resolve(__dirname, '../', 'store', bucketName, fileName)
        if (!this.fileUtil.exist(realPath)) {
            throw new HttpException('指定文件不存在', 404)
        }
        //判断空间是否存在，由于要判断公有、私有空间，这里需要查询出空间
        let bucket: Bucket = await this.bucketRepository.createQueryBuilder("bucket")
            .leftJoinAndSelect("bucket.image_config", "image_config")
            .leftJoinAndSelect("bucket.audio_config", "audio_config")
            .leftJoinAndSelect("bucket.video_config", "video_config")
            .where("bucket.name = :name", { name: bucketName })
            .getOne()
        if (!bucket) {
            throw new HttpException('指定空间' + bucketName + '不存在', 401)
        }
        //私有空间需要验证token
        if (bucket.public_or_private === 'private') {
            //token不存在
            if (!token) {
                throw new HttpException('访问私有空间文件需要token', 412)
            }
            //请求的全路径，包含协议、域名、端口、查询字符串，需要URL解码
            let fullUrl: string = decodeURI(req.protocol + '://' + req.get('host') + req.originalUrl)
            //获取计算token时使用的url
            if (imagePostProcessString) {
                //存储图片处理字符串时需要包含它
                fullUrl = fullUrl.substring(0, fullUrl.lastIndexOf('&token='))
            } else {
                //不存在图片处理字符串时，包含？之前的路径
                fullUrl = fullUrl.substring(0, fullUrl.lastIndexOf('?token='))
            }
            //根据空间配置、url验证token
            this.tokenUtil.verify(fullUrl, bucket, token)
        }
        //解析图片处理字符串为对象
        let imagePostProcessInfo: ImagePostProcessInfo
        if (imagePostProcessString) {
            try {
                imagePostProcessInfo = JSON.parse(imagePostProcessString)
            } catch (err) {
                throw new HttpException('JSON解析错误:' + err.toString(), 409)
            }

        }
        //获取文件种类
        let type: string = fileName.substring(fileName.lastIndexOf('.') + 1)
        let kind: string = this.kindUtil.getKind(type)
        if (kind === 'image') {
            //图片需要使用处理工具进行处理之后返回，得到处理之后的buffer
            let buffer: Buffer = await this.imageProcessUtil.processAndOutput(bucket, realPath, imagePostProcessInfo)
            //获取处理后图片元数据，主要为获取其类型，因为经过处理图片类型可能已经改变
            let metadata: ImageMetadata = await this.imageProcessUtil.getMetadata(buffer)
            //设置文件类型头信息
            res.setHeader('Content-Type', mime.getType(metadata.format))
            //设置文件大小头信息
            res.setHeader('Content-Length', Buffer.byteLength(buffer))
            //私有空间
            if (bucket.public_or_private === 'private') {
                //文件不缓存，因为有token，暂时这样处理，也可以设置一个缓存时间
                res.setHeader('Cache-Control', ['no-store', 'no-cache'])
            }
            //文件默认显示在浏览器中，不下载，如果浏览器不支持文件类型，还是会下载
            res.setHeader('Content-Disposition', 'inline')
            res.end(buffer)
        } else {
            //其他类型暂不支持
        }
    }



}