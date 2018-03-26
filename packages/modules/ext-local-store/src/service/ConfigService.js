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
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const ImageConfig_entity_1 = require("../model/ImageConfig.entity");
const AudioConfig_entity_1 = require("../model/AudioConfig.entity");
const VideoConfig_entity_1 = require("../model/VideoConfig.entity");
const typeorm_2 = require("@nestjs/typeorm");
const RestfulUtil_1 = require("../util/RestfulUtil");
const Bucket_entity_1 = require("../model/Bucket.entity");
const Image_entity_1 = require("../model/Image.entity");
const FileUtil_1 = require("../util/FileUtil");
const crypto = require("crypto");
let ConfigService = class ConfigService {
    constructor(fileUtil, restfulUtil, imageRepository, bucketRepository, imageConfigRepository, audioConfigRepository, videoConfigRepository) {
        this.fileUtil = fileUtil;
        this.restfulUtil = restfulUtil;
        this.imageRepository = imageRepository;
        this.bucketRepository = bucketRepository;
        this.imageConfigRepository = imageConfigRepository;
        this.audioConfigRepository = audioConfigRepository;
        this.videoConfigRepository = videoConfigRepository;
    }
    saveBucketConfig(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist;
            let newBucket = this.bucketRepository.create({
                name: body.name,
                operator: body.operator,
                password: crypto.createHash('md5').update(body.password).digest('hex'),
                directory: body.directory,
                base_url: body.base_url,
                request_expire: body.request_expire
            });
            if (body.isPublic) {
                exist = yield this.bucketRepository.findOneById(1);
            }
            else {
                exist = yield this.bucketRepository.findOneById(2);
                newBucket.token_expire = body.token_expire;
                newBucket.token_secret_key = body.token_secret_key;
            }
            if (exist) {
                try {
                    yield this.bucketRepository.updateById(exist.id, newBucket);
                }
                catch (err) {
                    throw new common_1.HttpException('空间配置更新失败' + err.toString(), 403);
                }
                return newBucket;
            }
            let audio_config = new AudioConfig_entity_1.AudioConfig();
            let video_config = new VideoConfig_entity_1.VideoConfig();
            let image_config = new ImageConfig_entity_1.ImageConfig();
            if (body.isPublic) {
                newBucket.id = 1;
                newBucket.public_or_private = 'public';
            }
            else {
                newBucket.id = 2;
                newBucket.public_or_private = 'private';
            }
            audio_config.id = newBucket.id;
            video_config.id = newBucket.id;
            image_config.id = newBucket.id;
            newBucket.audio_config = audio_config;
            newBucket.video_config = video_config;
            newBucket.image_config = image_config;
            try {
                yield this.bucketRepository.save(newBucket);
            }
            catch (err) {
                throw new common_1.HttpException('空间保存失败' + err.toString(), 403);
            }
            return newBucket;
        });
    }
    saveImageFormatConfig(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { format } = body;
            format = format.toLowerCase();
            if (format != 'raw' && format != 'webp_damage' && format != 'webp_undamage') {
                throw new common_1.HttpException('图片保存格式不正确', 400);
            }
            let buckets = yield this.bucketRepository.find({ relations: ["image_config"] });
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            try {
                for (let i = 0; i < buckets.length; i++) {
                    yield this.imageConfigRepository.updateById(buckets[i].image_config.id, { format });
                }
            }
            catch (err) {
                throw new common_1.HttpException('图片保存格式更新失败' + err.toString(), 403);
            }
            return;
        });
    }
    saveEnableImageWatermarkConfig(body) {
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
                for (let i = 0; i < buckets.length; i++) {
                    yield this.imageConfigRepository.updateById(buckets[i].image_config.id, { watermark_enable });
                }
            }
            catch (err) {
                throw new common_1.HttpException('水印启用保存失败' + err.toString(), 403);
            }
        });
    }
    saveImageWatermarkConfig(file, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let buckets = yield this.bucketRepository.find({ relations: ["image_config"] });
            let type = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            let buffer = yield this.fileUtil.read(file.path);
            let md5 = crypto.createHash('md5').update(buffer).digest('hex');
            for (let i = 0; i < buckets.length; i++) {
                if (buckets[i].image_config.format === 'webp_damage' || buckets[i].image_config.format === 'webp_undamage') {
                    type = 'webp';
                }
                let image = new Image_entity_1.Image();
                image.bucket = buckets[i];
                image.raw_name = file.name;
                image.name = md5 + '_' + (+new Date());
                image.type = type;
                image.status = 'post';
                let { width, height, frames } = yield this.restfulUtil.uploadFile(buckets[i], image, file, null);
                let { file_size, file_md5 } = yield this.restfulUtil.getFileInfo(buckets[i], image);
                image.width = width;
                image.height = height;
                image.frames = frames;
                image.size = file_size;
                image.md5 = file_md5;
                try {
                    yield this.imageRepository.save(image);
                }
                catch (err) {
                    throw new common_1.HttpException('水印图片保存失败' + err.toString(), 403);
                }
                try {
                    yield this.imageConfigRepository.updateById(buckets[i].image_config.id, {
                        watermark_save_key: '/' + buckets[i].directory + '/' + image.name + '.' + image.type,
                        watermark_gravity: obj.gravity,
                        watermark_opacity: obj.opacity,
                        watermark_ws: obj.ws,
                        watermark_x: obj.x,
                        watermark_y: obj.y
                    });
                }
                catch (err) {
                    throw new common_1.HttpException('水印配置更新失败' + err.toString(), 403);
                }
            }
            return;
        });
    }
    saveAudioFormatConfig(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { format } = body;
            format = format.toLowerCase();
            if (format != 'raw' && format != 'mp3' && format != 'aac') {
                throw new common_1.HttpException('音频保存格式不正确', 400);
            }
            let buckets = yield this.bucketRepository.find({ relations: ["audio_config"] });
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            try {
                for (let i = 0; i < buckets.length; i++) {
                    yield this.audioConfigRepository.updateById(buckets[i].audio_config.id, { format });
                }
            }
            catch (err) {
                throw new common_1.HttpException('音频保存格式更新失败' + err.toString(), 403);
            }
        });
    }
    saveVideoFormatConfig(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { format, resolution } = body;
            format = format.toLowerCase();
            if (format != 'raw' && format != 'vp9' && format != 'h264' && format != 'h265') {
                throw new common_1.HttpException('视频编码格式不正确', 400);
            }
            resolution = resolution.toLowerCase();
            if (resolution != 'raw' && resolution != 'p1080' && resolution != 'p720' && resolution != 'p480') {
                throw new common_1.HttpException('视频分辨率格式不正确', 400);
            }
            let buckets = yield this.bucketRepository.find({ relations: ["video_config"] });
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            try {
                for (let i = 0; i < buckets.length; i++) {
                    yield this.videoConfigRepository.updateById(buckets[i].video_config.id, { format, resolution });
                }
            }
            catch (err) {
                throw new common_1.HttpException('视频保存格式更新失败' + err.toString(), 403);
            }
            return;
        });
    }
};
ConfigService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject(FileUtil_1.FileUtil)),
    __param(1, common_1.Inject(RestfulUtil_1.RestfulUtil)),
    __param(2, typeorm_2.InjectRepository(Image_entity_1.Image)),
    __param(3, typeorm_2.InjectRepository(Bucket_entity_1.Bucket)),
    __param(4, typeorm_2.InjectRepository(ImageConfig_entity_1.ImageConfig)),
    __param(5, typeorm_2.InjectRepository(AudioConfig_entity_1.AudioConfig)),
    __param(6, typeorm_2.InjectRepository(VideoConfig_entity_1.VideoConfig)),
    __metadata("design:paramtypes", [FileUtil_1.FileUtil,
        RestfulUtil_1.RestfulUtil,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], ConfigService);
exports.ConfigService = ConfigService;
