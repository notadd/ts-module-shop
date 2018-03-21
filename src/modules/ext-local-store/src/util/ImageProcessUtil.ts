import { Component, Inject, HttpException } from '@nestjs/common';
import { ImagePostProcessInfo, ImagePreProcessInfo, Resize, Tailor, Blur } from '../interface/file/ImageProcessInfo';
import { ImageMetadata } from '../interface/file/ImageMetadata';
import { Bucket } from '../model/Bucket';
import { KindUtil } from './KindUtil';
import { FileUtil } from './FileUtil';
import { SharpInstance } from 'sharp';
import { isArray } from 'util';
import * as sharp from 'sharp';
import * as crypto from 'crypto';
import * as path from 'path';
import * as gm from 'gm';


/* 图片处理工具类 */
@Component()
export class ImageProcessUtil {
    private readonly gravity: Set<string>
    constructor(
        @Inject(KindUtil) private readonly kindUtil: KindUtil,
        @Inject(FileUtil) private readonly fileUtil: FileUtil
    ) {
        //重心集合，在裁剪与水印中使用
        this.gravity = new Set(['northwest', 'north', 'northeast', 'west', 'center', 'east', 'southwest', 'south', 'southeast'])
    }

    //获取指定图片、字节缓冲的图片元数据，参数可以为图片路径或者Buffer对象
    //根据路径获取元数据目前不使用，主要是根据获得的Buffer获取元数据
    async getMetadata(pathOrBuffer: string | Buffer): Promise<ImageMetadata> {
        //使用sharp获取，格式、宽度、高度
        let { format, width, height } = await sharp(pathOrBuffer).metadata()
        let size, name
        //为路径时
        if (typeof pathOrBuffer === 'string') {
            let buffer = await this.fileUtil.read(pathOrBuffer)
            size = await this.fileUtil.size(pathOrBuffer)
            //计算sha256为图片名称
            name = crypto.createHash('sha256').update(buffer).digest('hex')
        } else {
            //获取BUffer字节大小
            size = Buffer.byteLength(pathOrBuffer)
            //计算sha256为名称
            name = crypto.createHash('sha256').update(pathOrBuffer).digest('hex')
        }
        return {
            name,
            format,
            width,
            height,
            size
        }
    }

    //根据图片处理信息处理指定路径图片，并且按照配置保存它，返回处理后图片元数据，用于上传时保存图片
    async processAndStore(imagePath: string, bucket: Bucket, imageProcessInfo: ImagePostProcessInfo | ImagePreProcessInfo): Promise<ImageMetadata> {
        //获取处理后Buffer，这里必须先获取BUffer，再获取format、name，才能写入文件，因为文件名需要使用name、format
        //不能直接使用toFile
        let buffer: Buffer = await this.preProcess(imagePath, bucket, imageProcessInfo)
        //获取处理后元数据
        let metadata: ImageMetadata = await this.getMetadata(buffer)
        //处理后图片绝对路径
        let absolute_path: string = path.resolve(__dirname, '../', 'store', bucket.name, metadata.name + '.' + metadata.format)
        await this.fileUtil.write(absolute_path, buffer)
        //返回处理后元数据
        return metadata
    }

    //根据图片处理信息处理指定路径图片，返回内存中字节存储,用于向客户端输出图片
    async processAndOutput(bucket: Bucket, imagePath: string, imageProcessInfo: ImagePostProcessInfo | ImagePreProcessInfo): Promise<Buffer> {
        //返回Buffer对象
        return await this.postProcess(imagePath, bucket, imageProcessInfo)
    }


    //sharp实例预处理函数，用于上传预处理使用，只支持缩放、裁剪、水印、旋转四个参数
    //这个函数直接输出处理后的buffer，因为其中可能生成临时文件，临时文件删除后sharp实例获取Buffer会出错
    async preProcess(imagePath: string, bucket: Bucket, imageProcessInfo: ImagePreProcessInfo): Promise<Buffer> {
        let instance: SharpInstance = sharp(imagePath)
        //因为sharp支持角度过少，旋转采用gm生成旋转临时图片，保存临时图片路径，最后删除
        //因为sharp不支持水印透明度，采用gm添加水印，因为gm不支持水印图片大小调整，则生成临时水印图片，最后删除
        let rotateImagePath: string, watermarkImagePath: string
        if (!imageProcessInfo) {
            return await instance.toBuffer()
        }
        let { resize, tailor, watermark, rotate, format, lossless } = imageProcessInfo as ImagePostProcessInfo
        //获取处理之前元数据
        let metadata: ImageMetadata = await this.getMetadata(imagePath)
        try {
            let width2, height2
            //缩放与裁剪都需要之前一步得到的图片宽高
            //如果存在裁剪，且为缩放之前裁剪
            if (tailor && tailor.isBefore) {
                //裁剪，获取裁剪之后宽高
                let result1 = this.tailor(instance, tailor, metadata.width, metadata.height)
                //如果缩放存在，使用裁剪之后宽高，进行缩放
                if (resize) {
                    let result2 = this.resize(instance, resize, result1.width, result1.height)
                    width2 = result2.width
                    height2 = result2.height
                }
                width2 = result1.width
                height2 = result1.height
            }
            //如果裁剪存在，且为缩放之后裁剪
            else if (tailor && !tailor.isBefore) {
                //如果缩放存在
                if (resize) {
                    //先缩放，获取缩放后宽高
                    let result1 = this.resize(instance, resize, metadata.width, metadata.height)
                    //使用缩放后宽高进行裁剪
                    let result2 = this.tailor(instance, tailor, result1.width, result1.height)
                    width2 = result2.width
                    height2 = result2.height
                } else {
                    //缩放不存在，直接使用原图大小进行裁剪
                    let result1 = this.tailor(instance, tailor, metadata.width, metadata.height)
                    width2 = result1.width
                    height2 = result1.height
                }
            }
            //如果裁剪不存在
            else {
                //如果缩放存在
                if (resize) {
                    //直接使用原图大小缩放
                    let result1 = this.resize(instance, resize, metadata.width, metadata.height)
                    width2 = result1.width
                    height2 = result1.height
                } else {
                    width2 = metadata.width
                    height2 = metadata.height
                }
            }
            //水印统一最后添加
            //预处理时，只有明确指定添加水印才会添加
            //水印在旋转之前添加，一起旋转
            if (watermark === true) {
                //获取生成的临时图片路径，这个图片已经添加了水印
                watermarkImagePath = await this.watermark(bucket, instance, metadata, watermark, width2, height2)
                //重新设置sharp实例引用，为生成的临时图片，这个图片已经使用gm加上了水印，这里必然加水印
                instance = sharp(watermarkImagePath)
            }
            if (rotate) {
                //获取中间生成的临时文件路径，因为旋转需要使用gm
                rotateImagePath = await this.rotate(instance, metadata, rotate, width2, height2)
                //重新获取Sharp实例
                instance = sharp(rotateImagePath)
            }
            if (format) this.format(instance, format)
            if (lossless) {
                this.output(instance, format ? format : metadata.format, lossless, null, null)
            }
        } catch (err) {
            if(err instanceof HttpException){
                throw err
            }else{
                throw new HttpException(err.toString(), 408)
            }
        } 
        //这里不使用finally块来清理临时文件，因为删除方法可能抛出异常，这个异常不知道在finally块里面如何处理
        //删除旋转临时图片
        let result:Buffer = await instance.toBuffer()
        if (rotateImagePath) {
            await this.fileUtil.deleteIfExist(rotateImagePath)
        }
        //删除水印临时图片
        if (watermarkImagePath) {
            await this.fileUtil.deleteIfExist(watermarkImagePath)
        }
        return result
    }

    //sharp实例后处理函数、用于输出访问图片时使用
    async postProcess(imagePath: string, bucket: Bucket, imageProcessInfo: ImagePostProcessInfo): Promise<Buffer> {
        let instance: SharpInstance = sharp(imagePath)
        //因为sharp支持角度过少，旋转采用gm生成旋转临时图片，保存临时图片路径，最后删除
        //因为sharp不支持水印透明度，采用gm添加水印，因为gm不支持水印图片大小调整，则生成临时水印图片，最后删除
        let rotateImagePath: string, watermarkImagePath: string
        if (!imageProcessInfo) {
            //由于try块最后finally要删除临时图片，所以这里需要生成buffer，删除图片之后生成buffer出错
            return await instance.toBuffer()
        }
        let { resize, tailor, watermark, rotate, blur, sharpen, format, lossless, strip, quality, progressive } = imageProcessInfo
        //获取处理之前元数据
        let metadata: ImageMetadata = await this.getMetadata(imagePath)
        try {
            let width2, height2
            //缩放与裁剪都需要之前一步得到的图片宽高
            //如果存在裁剪，且为缩放之前裁剪
            if (tailor && tailor.isBefore) {
                //裁剪，获取裁剪之后宽高
                let result1 = this.tailor(instance, tailor, metadata.width, metadata.height)
                //如果缩放存在，使用裁剪之后宽高，进行缩放
                if (resize) {
                    let result2 = this.resize(instance, resize, result1.width, result1.height)
                    width2 = result2.width
                    height2 = result2.height
                }
                width2 = result1.width
                height2 = result1.height
            }
            //如果裁剪存在，且为缩放之后裁剪
            else if (tailor && !tailor.isBefore) {
                //如果缩放存在
                if (resize) {
                    //先缩放，获取缩放后宽高
                    let result1 = this.resize(instance, resize, metadata.width, metadata.height)
                    //使用缩放后宽高进行裁剪
                    let result2 = this.tailor(instance, tailor, result1.width, result1.height)
                    width2 = result2.width
                    height2 = result2.height
                } else {
                    //缩放不存在，直接使用原图大小进行裁剪
                    let result1 = this.tailor(instance, tailor, metadata.width, metadata.height)
                    width2 = result1.width
                    height2 = result1.height
                }
            }
            //如果裁剪不存在
            else {
                //如果缩放存在
                if (resize) {
                    //直接使用原图大小缩放
                    let result1 = this.resize(instance, resize, metadata.width, metadata.height)
                    width2 = result1.width
                    height2 = result1.height
                } else {
                    width2 = metadata.width
                    height2 = metadata.height
                }
            }
            //这里无论如何肉会进入水印方法，然后根据配置与参数决定是否添加水印
            watermarkImagePath = await this.watermark(bucket, instance, metadata, watermark, width2, height2)
            //这里不一定会加水印，如果加了水印，要重新设置sharp实例为指向临时文件
            if (watermarkImagePath) {
                instance = sharp(watermarkImagePath)
            }
            if (rotate) {
                rotateImagePath = await this.rotate(instance, metadata, rotate, width2, height2)
                instance = sharp(rotateImagePath)
            }
            if (blur) this.blur(instance, blur)
            if (sharpen) this.sharpen(instance, sharpen)
            if (format) this.format(instance, format)
            if (strip) this.strip(instance, strip)
            if (lossless || quality || progressive) {
                this.output(instance, format ? format : metadata.format, lossless, quality, progressive)
            }
            
        } catch (err) {
            if(err instanceof HttpException){
                throw err
            }else{
                throw new HttpException(err.toString(), 408)
            }
        }
        //这里不使用finally块来清理临时文件，因为删除方法可能抛出异常，这个异常不知道在finally块里面如何处理
        //删除旋转临时图片
        let result:Buffer = await instance.toBuffer()
        if (rotateImagePath) {
            await this.fileUtil.deleteIfExist(rotateImagePath)
        }
        //删除水印临时图片
        if (watermarkImagePath) {
            await this.fileUtil.deleteIfExist(watermarkImagePath)
        }
        return result
    }


    resize(instance: SharpInstance, resize: Resize, preWidth: number, preHeight: number): any {
        //获取参数
        let { mode, data } = resize
        //声明resize方法的参数
        let width, height
        //等比缩放
        if (mode == 'scale') {
            if (data.scale && Number.isInteger(data.scale) && data.scale >= 1 && data.scale <= 1000) {
                //等比缩放直接用原宽高乘以比例
                width = preWidth * data.scale / 100
                height = preHeight * data.scale / 100
            }
            else {
                throw new Error('缩放比例错误')
            }
        }
        //只缩放宽度
        else if (mode == 'wscale') {
            if (data.wscale && Number.isInteger(data.wscale) && data.wscale >= 1 && data.wscale <= 1000) {
                //只缩放宽度，给原宽度乘以比例
                width = preWidth * data.wscale / 100
                height = preHeight
            } else {
                throw new Error('宽度缩放比例错误')
            }
        }
        //只缩放高度
        else if (mode == 'hscale') {
            if (data.hscale && Number.isInteger(data.hscale) && data.hscale >= 1 && data.hscale <= 1000) {
                //只缩放高度，给高度乘以比例
                width = preWidth
                height = preHeight * data.hscale / 100
            } else {
                throw new Error('高度缩放比例错误')
            }
        }
        //指定宽高缩放
        else if (mode == 'both') {
            if (data.width && Number.isInteger(data.width) && data.height && Number.isInteger(data.height)) {
                //指定宽高缩放，直接使用参数中宽高
                width = data.width
                height = data.height
            } else {
                throw new Error('宽高参数错误')
            }
        }
        //指定宽度等比缩放
        else if (mode == 'fw') {
            if (data.width && Number.isInteger(data.width)) {
                //指定宽度等比缩放，宽度为参数值
                width = data.width
                //高度为原高度乘以宽度缩放比
                height = preHeight * data.width / preWidth
            } else {
                throw new Error('宽度参数错误')
            }
        }
        //指定高度等比缩放
        else if (mode == 'fh') {
            if (data.height && Number.isInteger(data.height)) {
                //指定高度等比缩放，高度为参数值
                height = data.height
                //宽度为原宽度乘以高度缩放比
                width = preWidth * data.height / preHeight
            } else {
                throw new Error('高度参数错误')
            }
        }
        //指定像素等比缩放
        else if (mode == 'fp') {
            if (data.pixel && Number.isInteger(data.pixel) && data.pixel >= 1 && data.pixel <= 25000000) {
                //指定像素等比缩放，高度平方乘以宽高比等于像素值
                height = Math.sqrt(data.pixel * preHeight / preWidth)
                //宽高乘积为像素值
                width = data.pixel / height
            } else {
                throw new Error('像素参数不正确')
            }
        }
        //限制宽高最大值，如果宽高都已经小于限制值，那就不变
        //宽高有大于限制值的，按照宽、高中较小缩放比缩放，保证缩放结果宽高都小于限制值
        else if (mode == 'fwfh') {
            if (data.width && Number.isInteger(data.width) && data.height && Number.isInteger(data.height)) {
                //宽高都为参数值，后面要链式使用max函数
                width = data.width
                height = data.height
            } else {
                throw new Error('宽高参数不正确')
            }
        }
        //闲置宽高最小值，如果宽高都已经大于限制值，那就不变
        //宽高有小于限制值的，按照宽、高较大缩放比缩放，保证缩放结果宽高都大于限制值
        else if (mode == 'fwfh2') {
            if (data.width && Number.isInteger(data.width) && data.height && Number.isInteger(data.height)) {
                width = data.width
                height = data.height
            } else {
                throw new Error('宽高参数不正确')
            }
        } else {
            throw new Error('缩放模式不正确')
        }
        //为sharp实例添加缩放处理,默认宽高不足时不裁剪，只缩放
        instance.resize(Math.floor(width), Math.floor(height)).ignoreAspectRatio()
        //下面要计算缩放后宽高，以及添加限制函数
        //只有fwfh、fwfh2两个模式要特殊处理
        //当限制宽高最大值时
        if (mode == 'fwfh') {
            instance.max()
            //如果高度大于限制值，宽度小于等于限制值
            if (data.width >= preWidth && data.height < preHeight) {
                //按照高度缩放比缩放
                height = data.height
                width = preWidth * data.height / preHeight
            }
            //宽度大于，而高度小于等于时
            else if (data.width < preWidth && data.height >= preHeight) {
                //按照宽度缩放比缩放
                width = data.width
                height = preHeight * data.width / preWidth
            }
            //两个都大于时
            else if (data.width < preWidth && data.height < preHeight) {
                //按照较小缩放比缩放
                let wscale = data.width / preWidth
                let hscale = data.height / preHeight
                let scale = wscale < hscale ? wscale : hscale
                width = preWidth * scale
                height = preHeight * scale
            }
            //两个都小于时
            else {
                //宽高为原始值
                width = preWidth
                height = preHeight
            }
        }
        //限制宽高最小值时
        else if (mode == 'fwfh2') {
            instance.min()
            //当宽度大于等于限制值，二高度小于限制值时
            if (data.width <= preWidth && data.height > preHeight) {
                //按照高度缩放比缩放
                height = data.height
                width = preWidth * data.height / preHeight
            }
            //当宽度小于限制值，高度大于等于限制值时，按照宽度缩放比缩放
            else if (data.width > preWidth && data.height <= preHeight) {
                width = data.width
                height = preHeight * data.width / preWidth
            }
            //当宽、高都小于限制值时
            else if (data.width > preWidth && data.height > preHeight) {
                //按照较大缩放比缩放
                let wscale = data.width / preWidth
                let hscale = data.height / preHeight
                let scale = wscale > hscale ? wscale : hscale
                width = preWidth * scale
                height = preHeight * scale
            }
            //当宽高都大于限制值时
            else {
                //宽高为原始值
                width = preWidth
                height = preHeight
            }
        }
        //返回缩放后宽高
        return { width, height }
    }

    //裁剪函数
    //裁剪原理：首先选定九宫格方位，然后在不同方位按照宽高选定裁剪区域，九宫格暂定按照三分之一线划分
    //四个角：northwest、southwest、northeast、southeast，宽度、高度都是相对于角点的
    //南北：north、south，高度从顶边、底边开始算，宽度对称于垂直中间线
    //东西：west、east，宽度从左边、右边开始算，高度对称于水平中间线
    //中心：center，宽度、高度分别对称于垂直、水平中间线
    //然后计算偏移，x正向为右、负向为左，y正向为下，负向为上，如果偏移后超出外边界，则自动丢弃
    //在测试中出现了超出内边界出现not found错误的问题，可能是暂时错误，暂时不管
    tailor(instance: SharpInstance, tailor: Tailor, preWidth: number, preHeight: number): any {
        //获取参数，根据这些参数计算最后的左偏移、顶偏移、宽高
        let { x, y, gravity } = tailor
        //声明裁剪宽高，初始值为参数值
        let width = tailor.width
        let height = tailor.height
        //声明左偏移，顶部偏移，不能为负
        let left, top
        //方位为西北
        if (gravity === 'northwest') {
            //初始偏移为0、0
            left = 0
            top = 0
        }
        //方位为东北
        else if (gravity === 'northeast') {
            //初始偏移,左偏移为原始宽度减去裁剪宽度
            left = preWidth - width
            top = 0
        }
        //方位为西南
        else if (gravity === 'southwest') {
            left = 0
            top = preHeight - height
        }
        //方位为东南
        else if (gravity === 'southeast') {
            left = preWidth - width
            top = preHeight - height
        }
        //方位为东
        else if (gravity === 'east') {
            left = preWidth - width
            top = preHeight / 2 - height / 2
        }
        //方位为西
        else if (gravity === 'west') {
            left = 0
            top = preHeight / 2 - height / 2
        }
        //方位为南
        else if (gravity === 'south') {
            left = preWidth / 2 - width / 2
            top = preHeight - height
        }
        //方位为北
        else if (gravity === 'north') {
            left = preWidth / 2 - width / 2
            top = 0
        }
        //方位为中心
        else if (gravity === 'center') {
            left = preWidth / 2 - width / 2
            top = preHeight / 2 - height / 2
        } else {
            throw new Error('裁剪方位不正确')
        }
        //偏移加上x、y
        left += x
        top += y
        //如果偏移为负，修改为0,同时修改宽高
        if (left < 0) {
            width += left
            left = 0
        }
        if (top < 0) {
            height += top
            top = 0
        }
        //如果偏移加上宽度大于了原始宽高
        if ((left + width) > preWidth) {
            width = preWidth - left
        }
        if ((top + height) > preHeight) {
            height = preHeight - top
        }
        //为sharp实例添加裁剪处理
        instance.extract({
            left: Math.floor(left),
            top: Math.floor(top),
            width: Math.floor(width),
            height: Math.floor(height)
        })
        return { width, height }
    }

    //水印处理函数
    //水印原理：首先根据ws短边自适应比例确定水印图片宽高，短边指的是原图的较短边
    //根据gravity给水印图片定位，如果是四个角，则角点重合，如果是四条边，则边重合，关于中心线对称，如果是中心，则关于两条中心线对称
    //根据x、y进行偏移，x、y只支持正整数，如果是四个角，都是向原图内部偏移，东西两条边，只向内部偏移x，南北两条边，只向内部偏移y，重心不偏移
    //且水印图片宽高都不能超过原图，超过不能输出，如果水印图片宽高加上相应偏移超过了超过了原图宽高，则偏移会自动调整
    async watermark(bucket: Bucket, instance: SharpInstance, metadata: ImageMetadata, watermark: boolean, preWidth: number, preHeight: number): Promise<string> {
        let enable: boolean
        if (watermark === true) enable = true
        else if (watermark === false) enable = false
        else if (watermark == undefined) enable = !!bucket.image_config.watermark_enable
        else throw new Error('水印参数错误')
        if (enable) {
            //获取参数，根据这些参数计算最后的左偏移、顶偏移、宽高
            let x = bucket.image_config.watermark_x
            let y = bucket.image_config.watermark_y
            let ws = bucket.image_config.watermark_ws
            //透明度暂时不使用
            let opacity = bucket.image_config.watermark_opacity
            let gravity = bucket.image_config.watermark_gravity
            let shuiyin_path = path.resolve(__dirname, '../') + bucket.image_config.watermark_save_key
            //水印图片宽高
            let { width, height } = await this.getMetadata(shuiyin_path)
            //计算短边自适应后水印图片宽高
            if (preWidth < preHeight) {
                height = height * preWidth * ws / (100 * width)
                width = preWidth * ws / 100
            } else {
                width = width * preHeight * ws / (100 * height)
                height = preHeight * ws / 100
            }
            //转化为gm参数
            //方位为西北
            if (gravity === 'northwest') {
                gravity = 'NorthWest'
            }
            //方位为东北
            else if (gravity === 'northeast') {
                gravity = 'NorthEast'
            }
            //方位为西南
            else if (gravity === 'southwest') {
                gravity = 'SouthWest'
            }
            //方位为东南
            else if (gravity === 'southeast') {
                gravity = 'SouthEast'
            }
            //方位为东
            else if (gravity === 'east') {
                y = 0
                gravity = 'East'
            }
            //方位为西
            else if (gravity === 'west') {
                y = 0
                gravity = 'West'
            }
            //方位为南
            else if (gravity === 'south') {
                x = 0
                gravity = 'South'
            }
            //方位为北
            else if (gravity === 'north') {
                x = 0
                gravity = 'North'
            }
            //方位为中心
            else if (gravity === 'center') {
                x = 0
                y = 0
                gravity = 'Center'
            } else {
                throw new Error('水印方位不正确')
            }
            /* //如果偏移为负，不能输出
            if (left < 0 || top < 0) {
                throw new Error('水印图片超出界限')
            } */
            //水印图片大于原始宽高也不能输出
            if (width > preWidth || height > preHeight) {
                throw new Error('水印图片过大')
            }
            //获取临时原图、缩放后水印图片Buffer，生成存储临时路径
            let buffer: Buffer = await instance.toBuffer()
            let shuiyinBuffer: Buffer = await sharp(shuiyin_path).resize(Math.floor(width), Math.floor(height)).ignoreAspectRatio().toBuffer()
            let temp_path = path.resolve(__dirname, '../', 'store', 'temp', 'raw' + (+new Date()) + '.' + metadata.format)
            let shuiyin_temp_path = path.resolve(__dirname, '../', 'store', 'temp', 'shuiyin' + (+new Date()) + shuiyin_path.substring(shuiyin_path.lastIndexOf('.')))
            await this.fileUtil.write(temp_path,buffer)
            await this.fileUtil.write(shuiyin_temp_path,shuiyinBuffer)
            let ex : HttpException
            await new Promise((resolve, reject) => {
                gm(temp_path).composite(shuiyin_temp_path).gravity(gravity).geometry('+' + x + '+' + y).dissolve(opacity).write(temp_path, err => {
                    if (err) reject(new HttpException('为图片添加水印出现错误:' + err.toString(), 407))
                    resolve()
                })
            }).catch(err => {
                ex = err
            })
            if (ex) {
                throw ex
            }
            let a = true
            await this.fileUtil.delete(shuiyin_temp_path)
            return temp_path
        } else {
            return null
        }
    }

    /* 旋转，sharp只支持90、180、270度，由于sharp的旋转，不会改变宽高，所以90、180度旋转后需要宽高倒置 */
    async rotate(instance: SharpInstance, metadata: ImageMetadata, rotate: number, width: number, height: number): Promise<string> {
        if (!Number.isInteger(rotate)) {
            throw new Error('旋转角度不正确')
        }
        let buffer: Buffer = await instance.toBuffer()
        let temp_path = path.resolve(__dirname, '../', 'store', 'temp', (+new Date()) + '.' + metadata.format)
        let ex: HttpException
        //根据绝对路径保存图片
        await this.fileUtil.write(temp_path,buffer)
        await new Promise((resolve, reject) => {
            gm(temp_path).rotate('black',rotate).write(temp_path, err => {
                if (err) reject(new HttpException('旋转文件图片出现错误:' + err.toString(), 407))
                resolve()
            })
        }).catch(err => {
            ex = err
        })
        if (ex) {
            throw ex
        }
        return temp_path
    }

    /* 高斯模糊，sharp不支持模糊半径，sigma越大越模糊，20已经很模糊了 */
    blur(instance: SharpInstance, blur: Blur) {
        if (!Number.isInteger(blur.sigma)) {
            throw new Error('模糊标准差错误')
        }
        //sharp不支持模糊半径
        instance.blur(blur.sigma)
    }

    /* 锐化后图片会变大 */
    sharpen(instance: SharpInstance, sharpen: boolean) {
        if (sharpen === true) {
            instance.sharpen()
        }
        else if (sharpen == false) {

        }
        else throw new Error('锐化参数错误')
    }

    /* 转换图片格式，png格式比jpeg大很多，webp默认内为有损格式，比jpeg小 
       toFormat方法也支持选项，其中质量、渐进、无损等选项可以设置,虽然函数定义中没有无损选项，但实际上可以处理无损参数
       目前质量、无损、渐进等在output中设置，format只支持jpeg、png、webp、tiff等格式，不支持bmp、gif等格式
    */
    format(instance: SharpInstance, format: string) {
        if (this.kindUtil.isImage(format)) {
            instance.toFormat(format)
        } else {
            throw new Error('格式参数错误')
        }
    }

    /* 去除元信息后稍微变大一点 */
    strip(instance: SharpInstance, strip: boolean) {
        if (strip === true) {
        } else if (strip === false) {
            instance.withMetadata()
        } else {
            throw new Error('去除元信息参数错误')
        }
    }

    /* 图片质量下降，会变小
       渐进显示会变大

    */
    output(instance: SharpInstance, format: string, lossless: boolean, quality: number, progressive: boolean) {
        if (lossless !== undefined && lossless !== null && lossless !== true && lossless !== false) {
            throw new Error('无损参数错误')
        }
        if (quality !== undefined && quality !== null && !Number.isInteger(quality)) {
            throw new Error('质量参数错误')
        }
        if (progressive !== undefined && progressive !== null && progressive !== true && progressive !== false) {
            throw new Error('渐进参数错误')
        }
        let options: any = {
            force: true
        }
        if (lossless !== undefined && lossless !== null) options.lossless = lossless
        if (quality !== undefined && quality !== null) options.quality = quality
        if (progressive !== undefined && progressive !== null) options.progressive = progressive
        //jpeg不支持无损，加上了也无所谓
        if (format === 'jpeg') {
            instance.jpeg(options)
        }
        //png不支持质量、无损选项，加上了也不影响
        else if (format === 'png') {
            instance.png(options)
        }
        //webp则三个都支持
        else if (format === 'webp') {
            instance.webp(options)
        }
        //tiff不支持渐进、无损选项，加上也无所谓
        else if (format === 'tiff') {
            instance.tiff(options)
        } else {
            //不支持对其他类型的无损、质量、渐进处理，但是不报错
        }
    }

}