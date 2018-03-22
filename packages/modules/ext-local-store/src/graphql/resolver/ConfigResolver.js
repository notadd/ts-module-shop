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
const ExceptionInterceptor_1 = require("../../interceptor/ExceptionInterceptor");
const graphql_1 = require("@nestjs/graphql");
const ConfigService_1 = require("../../service/ConfigService");
const http_1 = require("http");
const typeorm_1 = require("@nestjs/typeorm");
const Bucket_entity_1 = require("../../model/Bucket.entity");
const KindUtil_1 = require("../../util/KindUtil");
const FileUtil_1 = require("../../util/FileUtil");
const typeorm_2 = require("typeorm");
let ConfigResolver = class ConfigResolver {
    constructor(fileUtil, kindUtil, configService, bucketRepository) {
        this.fileUtil = fileUtil;
        this.kindUtil = kindUtil;
        this.configService = configService;
        this.bucketRepository = bucketRepository;
        this.image_format = new Set(['raw', 'webp_damage', 'webp_undamage']);
        this.audio_format = new Set(['raw', 'mp3', 'aac']);
        this.video_format = new Set(['raw', 'vp9', 'h264', 'h265']);
        this.video_resolution = new Set(['raw', 'p1080', 'p720', 'p480']);
        this.gravity = new Set(['northwest', 'north', 'northeast', 'west', 'center', 'east', 'southwest', 'south', 'southeast']);
    }
    bucket(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { isPublic, name, token_expire, token_secret_key } = body;
            if (isPublic === undefined || isPublic === null || !name) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (isPublic !== true && isPublic !== false) {
                throw new common_1.HttpException('isPublic参数不正确', 400);
            }
            if (!isPublic && (!token_expire || !token_secret_key)) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (!isPublic && (token_expire < 0 || token_expire > 1800)) {
                throw new common_1.HttpException('token超时不正确', 400);
            }
            yield this.configService.saveBucketConfig(body);
            return { code: 200, message: '空间配置保存成功' };
        });
    }
    imageFormat(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let format = body.format;
            if (format == undefined || format.length == 0) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (!this.image_format.has(format)) {
                throw new common_1.HttpException('保存格式不正确', 400);
            }
            yield this.configService.saveImageFormat(body);
            return { code: 200, message: "图片保存格式配置保存成功" };
        });
    }
    enableImageWatermark(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let enable = body.enable;
            if (enable === null || enable === undefined) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (enable !== true && enable !== false) {
                throw new common_1.HttpException('参数enable错误', 400);
            }
            yield this.configService.saveEnableImageWatermark(body);
            return { code: 200, message: '图片水印启用配置保存成功' };
        });
    }
    imageWatermark(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let temp_path;
            try {
                let { name, gravity, opacity, x, y, ws } = body;
                if (!name || !body.base64 || !gravity || (opacity !== 0 && !opacity) || (x !== 0 && !x) || (y !== 0 && !y) || (ws !== 0 && !ws)) {
                    throw new common_1.HttpException('缺少参数', 400);
                }
                if (!this.gravity.has(gravity)) {
                    throw new common_1.HttpException('不允许的水印图片位置', 400);
                }
                if (!Number.isInteger(x)) {
                    throw new common_1.HttpException('x偏移不是整数', 400);
                }
                if (!Number.isInteger(y)) {
                    throw new common_1.HttpException('y偏移不是整数', 400);
                }
                if (!Number.isInteger(opacity)) {
                    throw new common_1.HttpException('透明度不是整数', 400);
                }
                else if (opacity <= 0) {
                    throw new common_1.HttpException('透明度小于0', 400);
                }
                else if (opacity > 100) {
                    throw new common_1.HttpException('透明度大于100', 400);
                }
                else {
                }
                if (!Number.isInteger(ws)) {
                    throw new common_1.HttpException('短边自适应比例不是整数', 400);
                }
                else if (ws <= 0) {
                    throw new common_1.HttpException('短边自适应比例不大于0', 400);
                }
                else {
                }
                temp_path = __dirname + '/' + name;
                yield this.fileUtil.write(temp_path, Buffer.from(body.base64, 'base64'));
                delete body.base64;
                let file = {
                    name: name,
                    path: temp_path
                };
                if (!this.kindUtil.isImage(file.name.substr(file.name.lastIndexOf('.') + 1))) {
                    throw new common_1.HttpException('不允许的水印图片类型', 400);
                }
                yield this.configService.saveImageWatermark(file, body);
            }
            catch (err) {
                throw err;
            }
            finally {
                if (temp_path) {
                    yield this.fileUtil.deleteIfExist(temp_path);
                }
            }
            return { code: 200, message: '图片水印配置成功' };
        });
    }
    audioFormat(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let format = body.format;
            if (!format) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (format != 'raw' && format != 'mp3' && format != 'aac') {
                throw new common_1.HttpException('音频保存格式不正确', 400);
            }
            yield this.configService.saveAudioFormat(body);
            return { code: 200, message: "音频保存格式配置保存成功" };
        });
    }
    videoFormat(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { format, resolution } = body;
            if (!format || !resolution) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (format != 'raw' && format != 'vp9' && format != 'h264' && format != 'h265') {
                throw new common_1.HttpException('编码格式不正确', 400);
            }
            if (resolution != 'raw' && resolution != 'p1080' && resolution != 'p720' && resolution != 'p480') {
                throw new common_1.HttpException('分辨率格式不正确', 400);
            }
            yield this.configService.saveVideoFormat(body);
            return { code: 200, message: "视频保存格式配置保存成功" };
        });
    }
    buckets(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let buckets = yield this.bucketRepository.createQueryBuilder('bucket')
                .select(['bucket.id', 'bucket.public_or_private', 'bucket.name'])
                .getMany();
            if (buckets.length !== 2) {
                throw new common_1.HttpException('空间配置不存在', 401);
            }
            return { code: 200, message: '获取空间配置成功', buckets };
        });
    }
};
__decorate([
    graphql_1.Mutation('bucket'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ConfigResolver.prototype, "bucket", null);
__decorate([
    graphql_1.Mutation('imageFormat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ConfigResolver.prototype, "imageFormat", null);
__decorate([
    graphql_1.Mutation('enableImageWatermark'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ConfigResolver.prototype, "enableImageWatermark", null);
__decorate([
    graphql_1.Mutation('imageWatermark'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ConfigResolver.prototype, "imageWatermark", null);
__decorate([
    graphql_1.Mutation('audioFormat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ConfigResolver.prototype, "audioFormat", null);
__decorate([
    graphql_1.Mutation('videoFormat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], ConfigResolver.prototype, "videoFormat", null);
__decorate([
    graphql_1.Query('buckets'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage]),
    __metadata("design:returntype", Promise)
], ConfigResolver.prototype, "buckets", null);
ConfigResolver = __decorate([
    graphql_1.Resolver('Config'),
    common_1.UseInterceptors(ExceptionInterceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(FileUtil_1.FileUtil)),
    __param(1, common_1.Inject(KindUtil_1.KindUtil)),
    __param(2, common_1.Inject(ConfigService_1.ConfigService)),
    __param(3, typeorm_1.InjectRepository(Bucket_entity_1.Bucket)),
    __metadata("design:paramtypes", [FileUtil_1.FileUtil,
        KindUtil_1.KindUtil,
        ConfigService_1.ConfigService,
        typeorm_2.Repository])
], ConfigResolver);
exports.ConfigResolver = ConfigResolver;
