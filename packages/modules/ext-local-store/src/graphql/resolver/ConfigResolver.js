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
const LocalExceptionFilter_1 = require("../../exception/LocalExceptionFilter");
const graphql_1 = require("@nestjs/graphql");
const ConfigService_1 = require("../../service/ConfigService");
const KindUtil_1 = require("../../util/KindUtil");
const FileUtil_1 = require("../../util/FileUtil");
const typeorm_1 = require("typeorm");
const http_1 = require("http");
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
            let data = {
                code: 200,
                message: '空间配置保存成功'
            };
            try {
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
            }
            catch (err) {
                if (err instanceof common_1.HttpException) {
                    data.code = err.getStatus();
                    data.message = err.getResponse() + '';
                }
                else {
                    console.log(err);
                    data.code = 500;
                    data.message = '出现了意外错误' + err.toString();
                }
            }
            return data;
        });
    }
    imageFormat(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: "图片保存格式配置保存成功"
            };
            try {
                let format = body.format;
                if (format == undefined || format.length == 0) {
                    throw new common_1.HttpException('缺少参数', 400);
                }
                if (!this.image_format.has(format)) {
                    throw new common_1.HttpException('保存格式不正确', 400);
                }
                yield this.configService.saveImageFormat(body);
            }
            catch (err) {
                if (err instanceof common_1.HttpException) {
                    data.code = err.getStatus();
                    data.message = err.getResponse() + '';
                }
                else {
                    console.log(err);
                    data.code = 500;
                    data.message = '出现了意外错误' + err.toString();
                }
            }
            return data;
        });
    }
    enableImageWatermark(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: '图片水印启用配置保存成功'
            };
            try {
                let enable = body.enable;
                if (enable === null || enable === undefined) {
                    throw new common_1.HttpException('缺少参数', 400);
                }
                if (enable !== true && enable !== false) {
                    throw new common_1.HttpException('参数enable错误', 400);
                }
                yield this.configService.saveEnableImageWatermark(body);
            }
            catch (err) {
                if (err instanceof common_1.HttpException) {
                    data.code = err.getStatus();
                    data.message = err.getResponse() + '';
                }
                else {
                    console.log(err);
                    data.code = 500;
                    data.message = '出现了意外错误' + err.toString();
                }
            }
            return data;
        });
    }
    imageWatermark(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: '图片水印配置成功'
            };
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
                if (err instanceof common_1.HttpException) {
                    data.code = err.getStatus();
                    data.message = err.getResponse() + '';
                }
                else {
                    console.log(err);
                    data.code = 500;
                    data.message = '出现了意外错误' + err.toString();
                }
            }
            finally {
                if (temp_path) {
                    yield this.fileUtil.deleteIfExist(temp_path);
                }
            }
            return data;
        });
    }
    audioFormat(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: "音频保存格式配置保存成功"
            };
            try {
                let format = body.format;
                if (!format) {
                    throw new common_1.HttpException('缺少参数', 400);
                }
                if (format != 'raw' && format != 'mp3' && format != 'aac') {
                    throw new common_1.HttpException('音频保存格式不正确', 400);
                }
                yield this.configService.saveAudioFormat(body);
            }
            catch (err) {
                if (err instanceof common_1.HttpException) {
                    data.code = err.getStatus();
                    data.message = err.getResponse() + '';
                }
                else {
                    console.log(err);
                    data.code = 500;
                    data.message = '出现了意外错误' + err.toString();
                }
            }
            return data;
        });
    }
    videoFormat(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: "视频保存格式配置保存成功"
            };
            try {
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
            }
            catch (err) {
                if (err instanceof common_1.HttpException) {
                    data.code = err.getStatus();
                    data.message = err.getResponse() + '';
                }
                else {
                    console.log(err);
                    data.code = 500;
                    data.message = '出现了意外错误' + err.toString();
                }
            }
            return data;
        });
    }
    buckets(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: '获取空间配置成功',
                buckets: []
            };
            try {
                let buckets = yield this.bucketRepository.createQueryBuilder('bucket')
                    .select(['bucket.id', 'bucket.public_or_private', 'bucket.name'])
                    .getMany();
                if (buckets.length !== 2) {
                    throw new common_1.HttpException('空间配置不存在', 401);
                }
                data.buckets = buckets;
            }
            catch (err) {
                if (err instanceof common_1.HttpException) {
                    data.code = err.getStatus();
                    data.message = err.getResponse() + '';
                }
                else {
                    console.log(err);
                    data.code = 500;
                    data.message = '出现了意外错误' + err.toString();
                }
            }
            return data;
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
    common_1.UseFilters(new LocalExceptionFilter_1.LocalExceptionFilter()),
    __param(0, common_1.Inject(FileUtil_1.FileUtil)),
    __param(1, common_1.Inject(KindUtil_1.KindUtil)),
    __param(2, common_1.Inject(ConfigService_1.ConfigService)),
    __param(3, common_1.Inject('LocalModule.BucketRepository')),
    __metadata("design:paramtypes", [FileUtil_1.FileUtil,
        KindUtil_1.KindUtil,
        ConfigService_1.ConfigService,
        typeorm_1.Repository])
], ConfigResolver);
exports.ConfigResolver = ConfigResolver;
