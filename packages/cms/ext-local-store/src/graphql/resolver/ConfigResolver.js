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
const ExceptionInterceptor_1 = require("../../interceptor/ExceptionInterceptor");
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const ConfigService_1 = require("../../service/ConfigService");
const RestfulUtil_1 = require("../../util/RestfulUtil");
const typeorm_1 = require("@nestjs/typeorm");
const Bucket_entity_1 = require("../../model/Bucket.entity");
const FileUtil_1 = require("../../util/FileUtil");
const KindUtil_1 = require("../../util/KindUtil");
const http_1 = require("http");
const typeorm_2 = require("typeorm");
let ConfigResolver = class ConfigResolver {
    constructor(fileUtil, kindUtil, restfulUtil, configService, bucketRepository) {
        this.fileUtil = fileUtil;
        this.kindUtil = kindUtil;
        this.restfulUtil = restfulUtil;
        this.configService = configService;
        this.bucketRepository = bucketRepository;
        this.gravity = new Set(['northwest', 'north', 'northeast', 'west', 'center', 'east', 'southwest', 'south', 'southeast']);
    }
    bucket(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { isPublic, name, operator, password, directory, base_url, request_expire } = body;
            if (isPublic === undefined || !name || !operator || !password || !directory || !base_url || !request_expire) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (isPublic !== true && isPublic !== false && isPublic !== 'true' && isPublic !== 'false') {
                throw new common_1.HttpException('isPublic参数不正确', 400);
            }
            if (!Number.isInteger(body.request_expire)) {
                throw new common_1.HttpException('请求超时参数为非整数', 400);
            }
            else if (body.request_expire < 0) {
                throw new common_1.HttpException('请求超时参数小于0', 400);
            }
            else if (body.request_expire > 1800) {
                throw new common_1.HttpException('请求超时参数大于1800', 400);
            }
            if (!isPublic) {
                if (!Number.isInteger(body.token_expire)) {
                    throw new common_1.HttpException('token超时参数为非整数', 400);
                }
                else if (body.token_expire < 0) {
                    throw new common_1.HttpException('token超时参数小于0', 400);
                }
                else if (body.token_expire > 1800) {
                    throw new common_1.HttpException('token超时参数大于1800', 400);
                }
            }
            let bucket = yield this.configService.saveBucketConfig(body);
            yield this.restfulUtil.createDirectory(bucket);
            return { code: 200, message: '空间配置成功' };
        });
    }
    imageFormat(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let format = body.format;
            if (format == undefined || format.length == 0) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            yield this.configService.saveImageFormatConfig(body);
            return { code: 200, message: "图片保存格式配置成功" };
        });
    }
    enableImageWatermark(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { enable } = body;
            if (enable === null || enable === undefined) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (enable !== true && enable !== false) {
                throw new common_1.HttpException('参数错误', 400);
            }
            yield this.configService.saveEnableImageWatermarkConfig(body);
            return { code: 200, message: '启用图片水印成功' };
        });
    }
    imageWatermarkConfig(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let tempPath = __dirname + '/' + body.name;
            try {
                let { name, base64, gravity, opacity, x, y, ws } = body;
                yield this.fileUtil.write(tempPath, Buffer.from(base64, 'base64'));
                let obj = {};
                let file = {};
                obj.x = x;
                obj.y = y;
                obj.opacity = opacity;
                obj.ws = ws;
                obj.gravity = gravity;
                file.name = name;
                file.path = tempPath;
                if (!this.gravity.has(obj.gravity)) {
                    throw new common_1.HttpException('不允许的水印图片位置', 400);
                }
                if (!Number.isInteger(obj.x)) {
                    throw new common_1.HttpException('x偏移不是整数', 400);
                }
                if (!Number.isInteger(obj.y)) {
                    throw new common_1.HttpException('y偏移不是整数', 400);
                }
                if (!Number.isInteger(obj.opacity)) {
                    throw new common_1.HttpException('透明度不是整数', 400);
                }
                else if (obj.opacity <= 0) {
                    throw new common_1.HttpException('透明度不大于0', 400);
                }
                else if (obj.opacity > 100) {
                    throw new common_1.HttpException('透明度大于100', 400);
                }
                else {
                }
                if (!Number.isInteger(obj.ws)) {
                    throw new common_1.HttpException('短边自适应比例不是整数', 400);
                }
                else if (obj.ws <= 0) {
                    throw new common_1.HttpException('短边自适应比例不大于0', 400);
                }
                else {
                }
                if (!this.kindUtil.isImage(file.name.substr(file.name.lastIndexOf('.') + 1))) {
                    throw new common_1.HttpException('不允许的水印图片类型', 400);
                }
                yield this.configService.saveImageWatermarkConfig(file, obj);
            }
            catch (err) {
                throw err;
            }
            finally {
                yield this.fileUtil.delete(tempPath);
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
            yield this.configService.saveAudioFormatConfig(body);
            return { code: 200, message: "音频保存格式配置成功" };
        });
    }
    videoFormat(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { format, resolution } = body;
            if (!format || !resolution) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            yield this.configService.saveVideoFormatConfig(body);
            return { code: 200, message: "视频保存格式配置成功" };
        });
    }
    buckets() {
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
], ConfigResolver.prototype, "imageWatermarkConfig", null);
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
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigResolver.prototype, "buckets", null);
ConfigResolver = __decorate([
    graphql_1.Resolver('Config'),
    common_1.UseInterceptors(ExceptionInterceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(FileUtil_1.FileUtil)),
    __param(1, common_1.Inject(KindUtil_1.KindUtil)),
    __param(2, common_1.Inject(RestfulUtil_1.RestfulUtil)),
    __param(3, common_1.Inject(ConfigService_1.ConfigService)),
    __param(4, typeorm_1.InjectRepository(Bucket_entity_1.Bucket)),
    __metadata("design:paramtypes", [FileUtil_1.FileUtil,
        KindUtil_1.KindUtil,
        RestfulUtil_1.RestfulUtil,
        ConfigService_1.ConfigService,
        typeorm_2.Repository])
], ConfigResolver);
exports.ConfigResolver = ConfigResolver;
