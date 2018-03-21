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
const ImageProcessUtil_1 = require("../util/ImageProcessUtil");
const ImageConfig_1 = require("../model/ImageConfig");
const AudioConfig_1 = require("../model/AudioConfig");
const VideoConfig_1 = require("../model/VideoConfig");
const FileUtil_1 = require("../util/FileUtil");
const Bucket_1 = require("../model/Bucket");
const Image_1 = require("../model/Image");
const typeorm_1 = require("typeorm");
const path = require("path");
let ConfigService = class ConfigService {
    constructor(fileUtil, imageProcessUtil, imageRepository, bucketRepository, imageConfigRepository, audioConfigRepository, videoConfigRepository) {
        this.fileUtil = fileUtil;
        this.imageProcessUtil = imageProcessUtil;
        this.imageRepository = imageRepository;
        this.bucketRepository = bucketRepository;
        this.imageConfigRepository = imageConfigRepository;
        this.audioConfigRepository = audioConfigRepository;
        this.videoConfigRepository = videoConfigRepository;
    }
    saveBucketConfig(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist;
            let newBucket = {
                name: body.name,
            };
            let directory_path = path.resolve(__dirname, '../', 'store', body.name);
            if (body.isPublic) {
                exist = yield this.bucketRepository.findOneById(1);
            }
            else {
                exist = yield this.bucketRepository.findOneById(2);
                newBucket.token_expire = +body.token_expire;
                newBucket.token_secret_key = body.token_secret_key;
            }
            if (exist) {
                try {
                    yield this.bucketRepository.updateById(exist.id, newBucket);
                    if (!this.fileUtil.exist(directory_path)) {
                        yield this.fileUtil.mkdir(directory_path);
                    }
                }
                catch (err) {
                    throw new common_1.HttpException('空间配置更新失败' + err.toString(), 410);
                }
                return;
            }
            let bucket = new Bucket_1.Bucket();
            let audio_config = new AudioConfig_1.AudioConfig();
            let video_config = new VideoConfig_1.VideoConfig();
            let image_config = new ImageConfig_1.ImageConfig();
            if (body.isPublic) {
                bucket.id = 1;
                bucket.public_or_private = 'public';
            }
            else {
                bucket.id = 2;
                bucket.public_or_private = 'private';
                bucket.token_expire = +body.token_expire;
                bucket.token_secret_key = body.token_secret_key;
            }
            bucket.name = body.name;
            audio_config.id = bucket.id;
            video_config.id = bucket.id;
            image_config.id = bucket.id;
            bucket.audio_config = audio_config;
            bucket.video_config = video_config;
            bucket.image_config = image_config;
            try {
                yield this.bucketRepository.save(bucket);
                if (!this.fileUtil.exist(directory_path)) {
                    yield this.fileUtil.mkdir(directory_path);
                }
            }
            catch (err) {
                throw new common_1.HttpException('空间保存失败' + err.toString(), 410);
            }
        });
    }
    saveImageFormat(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { format } = body;
            format = format.toLowerCase();
            let buckets = yield this.bucketRepository.find({ relations: ["image_config"] });
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            try {
                yield buckets.forEach((bucket) => __awaiter(this, void 0, void 0, function* () {
                    yield this.imageConfigRepository.updateById(bucket.image_config.id, { format });
                }));
            }
            catch (err) {
                throw new common_1.HttpException('图片保存格式更新失败' + err.toString(), 410);
            }
        });
    }
    saveEnableImageWatermark(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let buckets = yield this.bucketRepository.find({ relations: ["image_config"] });
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            let watermark_enable;
            if (body.enable) {
                watermark_enable = 1;
            }
            else {
                watermark_enable = 0;
            }
            try {
                yield buckets.forEach((bucket) => __awaiter(this, void 0, void 0, function* () {
                    yield this.imageConfigRepository.updateById(bucket.image_config.id, { watermark_enable });
                }));
            }
            catch (err) {
                throw new common_1.HttpException('水印启用更新失败' + err.toString(), 410);
            }
        });
    }
    saveImageWatermark(file, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let buckets = yield this.bucketRepository.find({ relations: ["image_config"] });
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            for (let i = 0; i < buckets.length; i++) {
                let metadata;
                let format = buckets[i].image_config.format || 'raw';
                if (format === 'raw') {
                    metadata = yield this.imageProcessUtil.processAndStore(file.path, buckets[i], { strip: true, watermark: false });
                }
                else if (format === 'webp_damage') {
                    metadata = yield this.imageProcessUtil.processAndStore(file.path, buckets[i], { format: 'webp', strip: true, watermark: false });
                }
                else if (format === 'webp_undamage') {
                    metadata = yield this.imageProcessUtil.processAndStore(file.path, buckets[i], { format: 'webp', lossless: true, strip: true, watermark: false });
                }
                let image = new Image_1.Image();
                image.bucket = buckets[i];
                image.raw_name = file.name;
                image.name = metadata.name;
                image.type = metadata.format;
                image.width = metadata.width;
                image.height = metadata.height;
                image.size = metadata.size;
                let isExist = yield this.imageRepository.findOne({ name: metadata.name, bucketId: buckets[i].id });
                if (!isExist) {
                    try {
                        yield this.imageRepository.save(image);
                    }
                    catch (err) {
                        yield this.fileUtil.delete(path.resolve(__dirname, '../', 'store', buckets[i].name, image.name + '.' + image.type));
                        throw new common_1.HttpException('水印图片保存失败' + err.toString(), 410);
                    }
                }
                try {
                    yield this.imageConfigRepository.updateById(buckets[i].image_config.id, {
                        watermark_save_key: '/store/' + buckets[i].name + '/' + image.name + '.' + image.type,
                        watermark_gravity: obj.gravity,
                        watermark_opacity: obj.opacity,
                        watermark_ws: obj.ws,
                        watermark_x: obj.x,
                        watermark_y: obj.y
                    });
                }
                catch (err) {
                    throw new common_1.HttpException('图片水印更新失败' + err.toString(), 410);
                }
            }
            yield this.fileUtil.delete(file.path);
        });
    }
    saveAudioFormat(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { format } = body;
            format = format.toLowerCase();
            let buckets = yield this.bucketRepository.find({ relations: ["audio_config"] });
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            try {
                yield buckets.forEach((bucket) => __awaiter(this, void 0, void 0, function* () {
                    yield this.audioConfigRepository.updateById(bucket.audio_config.id, { format });
                }));
            }
            catch (err) {
                throw new common_1.HttpException('音频保存格式更新失败' + err.toString(), 410);
            }
        });
    }
    saveVideoFormat(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { format, resolution } = body;
            format = format.toLowerCase();
            resolution = resolution.toLowerCase();
            let buckets = yield this.bucketRepository.find({ relations: ["video_config"] });
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            try {
                yield buckets.forEach((bucket) => __awaiter(this, void 0, void 0, function* () {
                    yield this.videoConfigRepository.updateById(bucket.video_config.id, { format, resolution });
                }));
            }
            catch (err) {
                throw new common_1.HttpException('视频保存格式更新失败' + err.toString(), 410);
            }
        });
    }
};
ConfigService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject(FileUtil_1.FileUtil)),
    __param(1, common_1.Inject(ImageProcessUtil_1.ImageProcessUtil)),
    __param(2, common_1.Inject('LocalModule.ImageRepository')),
    __param(3, common_1.Inject('LocalModule.BucketRepository')),
    __param(4, common_1.Inject('LocalModule.ImageConfigRepository')),
    __param(5, common_1.Inject('LocalModule.AudioConfigRepository')),
    __param(6, common_1.Inject('LocalModule.VideoConfigRepository')),
    __metadata("design:paramtypes", [FileUtil_1.FileUtil,
        ImageProcessUtil_1.ImageProcessUtil,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], ConfigService);
exports.ConfigService = ConfigService;
