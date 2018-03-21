"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const KindUtil_1 = require("./KindUtil");
const FileUtil_1 = require("./FileUtil");
const sharp = require("sharp");
const crypto = require("crypto");
const path = require("path");
const gm = require("gm");
let ImageProcessUtil = class ImageProcessUtil {
    constructor(kindUtil, fileUtil) {
        this.kindUtil = kindUtil;
        this.fileUtil = fileUtil;
        this.gravity = new Set(['northwest', 'north', 'northeast', 'west', 'center', 'east', 'southwest', 'south', 'southeast']);
    }
    getMetadata(pathOrBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            let { format, width, height } = yield sharp(pathOrBuffer).metadata();
            let size, name;
            if (typeof pathOrBuffer === 'string') {
                let buffer = yield this.fileUtil.read(pathOrBuffer);
                size = yield this.fileUtil.size(pathOrBuffer);
                name = crypto.createHash('sha256').update(buffer).digest('hex');
            }
            else {
                size = Buffer.byteLength(pathOrBuffer);
                name = crypto.createHash('sha256').update(pathOrBuffer).digest('hex');
            }
            return {
                name,
                format,
                width,
                height,
                size
            };
        });
    }
    processAndStore(imagePath, bucket, imageProcessInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = yield this.preProcess(imagePath, bucket, imageProcessInfo);
            let metadata = yield this.getMetadata(buffer);
            let absolute_path = path.resolve(__dirname, '../', 'store', bucket.name, metadata.name + '.' + metadata.format);
            yield this.fileUtil.write(absolute_path, buffer);
            return metadata;
        });
    }
    processAndOutput(bucket, imagePath, imageProcessInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postProcess(imagePath, bucket, imageProcessInfo);
        });
    }
    preProcess(imagePath, bucket, imageProcessInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = sharp(imagePath);
            let rotateImagePath, watermarkImagePath;
            if (!imageProcessInfo) {
                return yield instance.toBuffer();
            }
            let { resize, tailor, watermark, rotate, format, lossless } = imageProcessInfo;
            let metadata = yield this.getMetadata(imagePath);
            try {
                let width2, height2;
                if (tailor && tailor.isBefore) {
                    let result1 = this.tailor(instance, tailor, metadata.width, metadata.height);
                    if (resize) {
                        let result2 = this.resize(instance, resize, result1.width, result1.height);
                        width2 = result2.width;
                        height2 = result2.height;
                    }
                    width2 = result1.width;
                    height2 = result1.height;
                }
                else if (tailor && !tailor.isBefore) {
                    if (resize) {
                        let result1 = this.resize(instance, resize, metadata.width, metadata.height);
                        let result2 = this.tailor(instance, tailor, result1.width, result1.height);
                        width2 = result2.width;
                        height2 = result2.height;
                    }
                    else {
                        let result1 = this.tailor(instance, tailor, metadata.width, metadata.height);
                        width2 = result1.width;
                        height2 = result1.height;
                    }
                }
                else {
                    if (resize) {
                        let result1 = this.resize(instance, resize, metadata.width, metadata.height);
                        width2 = result1.width;
                        height2 = result1.height;
                    }
                    else {
                        width2 = metadata.width;
                        height2 = metadata.height;
                    }
                }
                if (watermark === true) {
                    watermarkImagePath = yield this.watermark(bucket, instance, metadata, watermark, width2, height2);
                    instance = sharp(watermarkImagePath);
                }
                if (rotate) {
                    rotateImagePath = yield this.rotate(instance, metadata, rotate, width2, height2);
                    instance = sharp(rotateImagePath);
                }
                if (format)
                    this.format(instance, format);
                if (lossless) {
                    this.output(instance, format ? format : metadata.format, lossless, null, null);
                }
            }
            catch (err) {
                if (err instanceof common_1.HttpException) {
                    throw err;
                }
                else {
                    throw new common_1.HttpException(err.toString(), 408);
                }
            }
            let result = yield instance.toBuffer();
            if (rotateImagePath) {
                yield this.fileUtil.deleteIfExist(rotateImagePath);
            }
            if (watermarkImagePath) {
                yield this.fileUtil.deleteIfExist(watermarkImagePath);
            }
            return result;
        });
    }
    postProcess(imagePath, bucket, imageProcessInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = sharp(imagePath);
            let rotateImagePath, watermarkImagePath;
            if (!imageProcessInfo) {
                return yield instance.toBuffer();
            }
            let { resize, tailor, watermark, rotate, blur, sharpen, format, lossless, strip, quality, progressive } = imageProcessInfo;
            let metadata = yield this.getMetadata(imagePath);
            try {
                let width2, height2;
                if (tailor && tailor.isBefore) {
                    let result1 = this.tailor(instance, tailor, metadata.width, metadata.height);
                    if (resize) {
                        let result2 = this.resize(instance, resize, result1.width, result1.height);
                        width2 = result2.width;
                        height2 = result2.height;
                    }
                    width2 = result1.width;
                    height2 = result1.height;
                }
                else if (tailor && !tailor.isBefore) {
                    if (resize) {
                        let result1 = this.resize(instance, resize, metadata.width, metadata.height);
                        let result2 = this.tailor(instance, tailor, result1.width, result1.height);
                        width2 = result2.width;
                        height2 = result2.height;
                    }
                    else {
                        let result1 = this.tailor(instance, tailor, metadata.width, metadata.height);
                        width2 = result1.width;
                        height2 = result1.height;
                    }
                }
                else {
                    if (resize) {
                        let result1 = this.resize(instance, resize, metadata.width, metadata.height);
                        width2 = result1.width;
                        height2 = result1.height;
                    }
                    else {
                        width2 = metadata.width;
                        height2 = metadata.height;
                    }
                }
                watermarkImagePath = yield this.watermark(bucket, instance, metadata, watermark, width2, height2);
                if (watermarkImagePath) {
                    instance = sharp(watermarkImagePath);
                }
                if (rotate) {
                    rotateImagePath = yield this.rotate(instance, metadata, rotate, width2, height2);
                    instance = sharp(rotateImagePath);
                }
                if (blur)
                    this.blur(instance, blur);
                if (sharpen)
                    this.sharpen(instance, sharpen);
                if (format)
                    this.format(instance, format);
                if (strip)
                    this.strip(instance, strip);
                if (lossless || quality || progressive) {
                    this.output(instance, format ? format : metadata.format, lossless, quality, progressive);
                }
            }
            catch (err) {
                if (err instanceof common_1.HttpException) {
                    throw err;
                }
                else {
                    throw new common_1.HttpException(err.toString(), 408);
                }
            }
            let result = yield instance.toBuffer();
            if (rotateImagePath) {
                yield this.fileUtil.deleteIfExist(rotateImagePath);
            }
            if (watermarkImagePath) {
                yield this.fileUtil.deleteIfExist(watermarkImagePath);
            }
            return result;
        });
    }
    resize(instance, resize, preWidth, preHeight) {
        let { mode, data } = resize;
        let width, height;
        if (mode == 'scale') {
            if (data.scale && Number.isInteger(data.scale) && data.scale >= 1 && data.scale <= 1000) {
                width = preWidth * data.scale / 100;
                height = preHeight * data.scale / 100;
            }
            else {
                throw new Error('缩放比例错误');
            }
        }
        else if (mode == 'wscale') {
            if (data.wscale && Number.isInteger(data.wscale) && data.wscale >= 1 && data.wscale <= 1000) {
                width = preWidth * data.wscale / 100;
                height = preHeight;
            }
            else {
                throw new Error('宽度缩放比例错误');
            }
        }
        else if (mode == 'hscale') {
            if (data.hscale && Number.isInteger(data.hscale) && data.hscale >= 1 && data.hscale <= 1000) {
                width = preWidth;
                height = preHeight * data.hscale / 100;
            }
            else {
                throw new Error('高度缩放比例错误');
            }
        }
        else if (mode == 'both') {
            if (data.width && Number.isInteger(data.width) && data.height && Number.isInteger(data.height)) {
                width = data.width;
                height = data.height;
            }
            else {
                throw new Error('宽高参数错误');
            }
        }
        else if (mode == 'fw') {
            if (data.width && Number.isInteger(data.width)) {
                width = data.width;
                height = preHeight * data.width / preWidth;
            }
            else {
                throw new Error('宽度参数错误');
            }
        }
        else if (mode == 'fh') {
            if (data.height && Number.isInteger(data.height)) {
                height = data.height;
                width = preWidth * data.height / preHeight;
            }
            else {
                throw new Error('高度参数错误');
            }
        }
        else if (mode == 'fp') {
            if (data.pixel && Number.isInteger(data.pixel) && data.pixel >= 1 && data.pixel <= 25000000) {
                height = Math.sqrt(data.pixel * preHeight / preWidth);
                width = data.pixel / height;
            }
            else {
                throw new Error('像素参数不正确');
            }
        }
        else if (mode == 'fwfh') {
            if (data.width && Number.isInteger(data.width) && data.height && Number.isInteger(data.height)) {
                width = data.width;
                height = data.height;
            }
            else {
                throw new Error('宽高参数不正确');
            }
        }
        else if (mode == 'fwfh2') {
            if (data.width && Number.isInteger(data.width) && data.height && Number.isInteger(data.height)) {
                width = data.width;
                height = data.height;
            }
            else {
                throw new Error('宽高参数不正确');
            }
        }
        else {
            throw new Error('缩放模式不正确');
        }
        instance.resize(Math.floor(width), Math.floor(height)).ignoreAspectRatio();
        if (mode == 'fwfh') {
            instance.max();
            if (data.width >= preWidth && data.height < preHeight) {
                height = data.height;
                width = preWidth * data.height / preHeight;
            }
            else if (data.width < preWidth && data.height >= preHeight) {
                width = data.width;
                height = preHeight * data.width / preWidth;
            }
            else if (data.width < preWidth && data.height < preHeight) {
                let wscale = data.width / preWidth;
                let hscale = data.height / preHeight;
                let scale = wscale < hscale ? wscale : hscale;
                width = preWidth * scale;
                height = preHeight * scale;
            }
            else {
                width = preWidth;
                height = preHeight;
            }
        }
        else if (mode == 'fwfh2') {
            instance.min();
            if (data.width <= preWidth && data.height > preHeight) {
                height = data.height;
                width = preWidth * data.height / preHeight;
            }
            else if (data.width > preWidth && data.height <= preHeight) {
                width = data.width;
                height = preHeight * data.width / preWidth;
            }
            else if (data.width > preWidth && data.height > preHeight) {
                let wscale = data.width / preWidth;
                let hscale = data.height / preHeight;
                let scale = wscale > hscale ? wscale : hscale;
                width = preWidth * scale;
                height = preHeight * scale;
            }
            else {
                width = preWidth;
                height = preHeight;
            }
        }
        return { width, height };
    }
    tailor(instance, tailor, preWidth, preHeight) {
        let { x, y, gravity } = tailor;
        let width = tailor.width;
        let height = tailor.height;
        let left, top;
        if (gravity === 'northwest') {
            left = 0;
            top = 0;
        }
        else if (gravity === 'northeast') {
            left = preWidth - width;
            top = 0;
        }
        else if (gravity === 'southwest') {
            left = 0;
            top = preHeight - height;
        }
        else if (gravity === 'southeast') {
            left = preWidth - width;
            top = preHeight - height;
        }
        else if (gravity === 'east') {
            left = preWidth - width;
            top = preHeight / 2 - height / 2;
        }
        else if (gravity === 'west') {
            left = 0;
            top = preHeight / 2 - height / 2;
        }
        else if (gravity === 'south') {
            left = preWidth / 2 - width / 2;
            top = preHeight - height;
        }
        else if (gravity === 'north') {
            left = preWidth / 2 - width / 2;
            top = 0;
        }
        else if (gravity === 'center') {
            left = preWidth / 2 - width / 2;
            top = preHeight / 2 - height / 2;
        }
        else {
            throw new Error('裁剪方位不正确');
        }
        left += x;
        top += y;
        if (left < 0) {
            width += left;
            left = 0;
        }
        if (top < 0) {
            height += top;
            top = 0;
        }
        if ((left + width) > preWidth) {
            width = preWidth - left;
        }
        if ((top + height) > preHeight) {
            height = preHeight - top;
        }
        instance.extract({
            left: Math.floor(left),
            top: Math.floor(top),
            width: Math.floor(width),
            height: Math.floor(height)
        });
        return { width, height };
    }
    watermark(bucket, instance, metadata, watermark, preWidth, preHeight) {
        return __awaiter(this, void 0, void 0, function* () {
            let enable;
            if (watermark === true)
                enable = true;
            else if (watermark === false)
                enable = false;
            else if (watermark == undefined)
                enable = !!bucket.image_config.watermark_enable;
            else
                throw new Error('水印参数错误');
            if (enable) {
                let x = bucket.image_config.watermark_x;
                let y = bucket.image_config.watermark_y;
                let ws = bucket.image_config.watermark_ws;
                let opacity = bucket.image_config.watermark_opacity;
                let gravity = bucket.image_config.watermark_gravity;
                let shuiyin_path = path.resolve(__dirname, '../') + bucket.image_config.watermark_save_key;
                let { width, height } = yield this.getMetadata(shuiyin_path);
                if (preWidth < preHeight) {
                    height = height * preWidth * ws / (100 * width);
                    width = preWidth * ws / 100;
                }
                else {
                    width = width * preHeight * ws / (100 * height);
                    height = preHeight * ws / 100;
                }
                if (gravity === 'northwest') {
                    gravity = 'NorthWest';
                }
                else if (gravity === 'northeast') {
                    gravity = 'NorthEast';
                }
                else if (gravity === 'southwest') {
                    gravity = 'SouthWest';
                }
                else if (gravity === 'southeast') {
                    gravity = 'SouthEast';
                }
                else if (gravity === 'east') {
                    y = 0;
                    gravity = 'East';
                }
                else if (gravity === 'west') {
                    y = 0;
                    gravity = 'West';
                }
                else if (gravity === 'south') {
                    x = 0;
                    gravity = 'South';
                }
                else if (gravity === 'north') {
                    x = 0;
                    gravity = 'North';
                }
                else if (gravity === 'center') {
                    x = 0;
                    y = 0;
                    gravity = 'Center';
                }
                else {
                    throw new Error('水印方位不正确');
                }
                if (width > preWidth || height > preHeight) {
                    throw new Error('水印图片过大');
                }
                let buffer = yield instance.toBuffer();
                let shuiyinBuffer = yield sharp(shuiyin_path).resize(Math.floor(width), Math.floor(height)).ignoreAspectRatio().toBuffer();
                let temp_path = path.resolve(__dirname, '../', 'store', 'temp', 'raw' + (+new Date()) + '.' + metadata.format);
                let shuiyin_temp_path = path.resolve(__dirname, '../', 'store', 'temp', 'shuiyin' + (+new Date()) + shuiyin_path.substring(shuiyin_path.lastIndexOf('.')));
                yield this.fileUtil.write(temp_path, buffer);
                yield this.fileUtil.write(shuiyin_temp_path, shuiyinBuffer);
                let ex;
                yield new Promise((resolve, reject) => {
                    gm(temp_path).composite(shuiyin_temp_path).gravity(gravity).geometry('+' + x + '+' + y).dissolve(opacity).write(temp_path, err => {
                        if (err)
                            reject(new common_1.HttpException('为图片添加水印出现错误:' + err.toString(), 407));
                        resolve();
                    });
                }).catch(err => {
                    ex = err;
                });
                if (ex) {
                    throw ex;
                }
                let a = true;
                yield this.fileUtil.delete(shuiyin_temp_path);
                return temp_path;
            }
            else {
                return null;
            }
        });
    }
    rotate(instance, metadata, rotate, width, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number.isInteger(rotate)) {
                throw new Error('旋转角度不正确');
            }
            let buffer = yield instance.toBuffer();
            let temp_path = path.resolve(__dirname, '../', 'store', 'temp', (+new Date()) + '.' + metadata.format);
            let ex;
            yield this.fileUtil.write(temp_path, buffer);
            yield new Promise((resolve, reject) => {
                gm(temp_path).rotate('black', rotate).write(temp_path, err => {
                    if (err)
                        reject(new common_1.HttpException('旋转文件图片出现错误:' + err.toString(), 407));
                    resolve();
                });
            }).catch(err => {
                ex = err;
            });
            if (ex) {
                throw ex;
            }
            return temp_path;
        });
    }
    blur(instance, blur) {
        if (!Number.isInteger(blur.sigma)) {
            throw new Error('模糊标准差错误');
        }
        instance.blur(blur.sigma);
    }
    sharpen(instance, sharpen) {
        if (sharpen === true) {
            instance.sharpen();
        }
        else if (sharpen == false) {
        }
        else
            throw new Error('锐化参数错误');
    }
    format(instance, format) {
        if (this.kindUtil.isImage(format)) {
            instance.toFormat(format);
        }
        else {
            throw new Error('格式参数错误');
        }
    }
    strip(instance, strip) {
        if (strip === true) {
        }
        else if (strip === false) {
            instance.withMetadata();
        }
        else {
            throw new Error('去除元信息参数错误');
        }
    }
    output(instance, format, lossless, quality, progressive) {
        if (lossless !== undefined && lossless !== null && lossless !== true && lossless !== false) {
            throw new Error('无损参数错误');
        }
        if (quality !== undefined && quality !== null && !Number.isInteger(quality)) {
            throw new Error('质量参数错误');
        }
        if (progressive !== undefined && progressive !== null && progressive !== true && progressive !== false) {
            throw new Error('渐进参数错误');
        }
        let options = {
            force: true
        };
        if (lossless !== undefined && lossless !== null)
            options.lossless = lossless;
        if (quality !== undefined && quality !== null)
            options.quality = quality;
        if (progressive !== undefined && progressive !== null)
            options.progressive = progressive;
        if (format === 'jpeg') {
            instance.jpeg(options);
        }
        else if (format === 'png') {
            instance.png(options);
        }
        else if (format === 'webp') {
            instance.webp(options);
        }
        else if (format === 'tiff') {
            instance.tiff(options);
        }
        else {
        }
    }
};
ImageProcessUtil = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject(KindUtil_1.KindUtil)),
    __param(1, common_1.Inject(FileUtil_1.FileUtil)),
    __metadata("design:paramtypes", [KindUtil_1.KindUtil,
        FileUtil_1.FileUtil])
], ImageProcessUtil);
exports.ImageProcessUtil = ImageProcessUtil;
