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
const typeorm_1 = require("typeorm");
const FileService_1 = require("../../service/FileService");
const RestfulUtil_1 = require("../../util/RestfulUtil");
const Bucket_entity_1 = require("../../model/Bucket.entity");
const typeorm_2 = require("@nestjs/typeorm");
const Image_entity_1 = require("../../model/Image.entity");
const File_entity_1 = require("../../model/File.entity");
const KindUtil_1 = require("../../util/KindUtil");
const AuthUtil_1 = require("../../util/AuthUtil");
const http_1 = require("http");
let FileResolver = class FileResolver {
    constructor(authUtil, kindUtil, restfulUtil, fileService, configService, fileRepository, imageRepository, bucketRepository) {
        this.authUtil = authUtil;
        this.kindUtil = kindUtil;
        this.restfulUtil = restfulUtil;
        this.fileService = fileService;
        this.configService = configService;
        this.fileRepository = fileRepository;
        this.imageRepository = imageRepository;
        this.bucketRepository = bucketRepository;
    }
    downloadProcess(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: '下载预处理成功',
                method: 'get',
                headers: {
                    authorization: '',
                    date: ''
                },
                url: 'http://v0.api.upyun.com'
            };
            let { bucketName, name, type } = body;
            if (!bucketName || !name) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            let bucket = yield this.bucketRepository.findOne({ name: bucketName });
            if (!bucket) {
                throw new common_1.HttpException('指定空间' + bucketName + '不存在', 401);
            }
            let kind;
            let status = 'post';
            let file;
            if (this.kindUtil.isImage(type)) {
                file = yield this.imageRepository.findOne({ name, type, bucketId: bucket.id });
            }
            else {
            }
            if (!file) {
                throw new common_1.HttpException('指定文件' + name + '不存在', 404);
            }
            data.url += '/' + bucket.name + '/' + bucket.directory + '/' + file.name + '.' + file.type;
            data.headers.date = new Date(+new Date() + bucket.request_expire * 1000).toUTCString();
            data.headers.authorization = yield this.authUtil.getHeaderAuth(bucket, 'GET', data.url.replace('http://v0.api.upyun.com', ''), data.headers.date, '');
            return data;
        });
    }
    uploadProcess(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: '上传预处理成功',
                url: 'http://v0.api.upyun.com',
                method: 'post',
                baseUrl: '',
                form: {
                    policy: '',
                    authorization: ''
                }
            };
            let { bucketName, md5, contentName } = body;
            if (!bucketName || !md5 || !contentName) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            if (md5.length !== 32) {
                throw new common_1.HttpException('md5参数不正确', 400);
            }
            let bucket = yield this.bucketRepository.createQueryBuilder("bucket")
                .leftJoinAndSelect("bucket.image_config", "image_config")
                .leftJoinAndSelect("bucket.audio_config", "audio_config")
                .leftJoinAndSelect("bucket.video_config", "video_config")
                .where("bucket.name = :name", { name: bucketName })
                .getOne();
            if (!bucket) {
                throw new common_1.HttpException('指定空间' + bucketName + '不存在', 401);
            }
            data.baseUrl = bucket.base_url;
            let image = yield this.fileService.preSaveFile(bucket, body);
            let policy = {
                'bucket': '',
                'save-key': '',
                'expiration': null,
                'date': '',
                'content-md5': md5,
                'notify-url': 'http://upyuns.frp2.chuantou.org/upyun/file/notify',
                'x-upyun-meta-ttl': 180,
                'ext-param': ''
            };
            yield this.fileService.makePolicy(data, policy, bucket, body, image);
            return data;
        });
    }
    getFile(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { bucketName, name, type } = body;
            if (!bucketName || !name || !type) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            let bucket = yield this.bucketRepository.createQueryBuilder("bucket")
                .leftJoinAndSelect("bucket.image_config", "image_config")
                .leftJoinAndSelect("bucket.audio_config", "audio_config")
                .leftJoinAndSelect("bucket.video_config", "video_config")
                .where("bucket.name = :name", { name: bucketName })
                .getOne();
            if (!bucket) {
                throw new common_1.HttpException('指定空间' + bucketName + '不存在', 401);
            }
            let kind = this.kindUtil.getKind(type);
            let file;
            if (kind === 'image') {
                file = yield this.imageRepository.findOne({ name, bucketId: bucket.id });
                if (!file) {
                    throw new common_1.HttpException('指定图片不存在', 404);
                }
            }
            else {
            }
            let url = yield this.fileService.makeUrl(bucket, file, body, kind);
            return { code: 200, message: "获取指定文件访问url成功", url: '' };
        });
    }
    files(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: '获取指定空间下所有文件成功',
                baseUrl: '',
                files: [],
                images: [],
                audios: [],
                videos: [],
                documents: []
            };
            let { bucketName } = body;
            if (!bucketName) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            let bucket = yield this.bucketRepository.findOne({ name: bucketName });
            if (!bucket) {
                throw new common_1.HttpException('空间' + bucketName + '不存在', 401);
            }
            data.baseUrl = bucket.base_url;
            yield this.fileService.getAll(data, bucket);
            return data;
        });
    }
    deleteFile(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { bucketName, type, name } = body;
            if (!bucketName || !name || !type) {
                throw new common_1.HttpException('缺少参数', 400);
            }
            let bucket = yield this.bucketRepository.findOne({ name: bucketName });
            if (!bucket) {
                throw new common_1.HttpException('空间' + bucketName + '不存在', 401);
            }
            let kind = this.kindUtil.getKind(type);
            if (kind === 'image') {
                let image = yield this.imageRepository.findOne({ name, bucketId: bucket.id });
                if (!image) {
                    throw new common_1.HttpException('文件md5=' + name + '不存在', 404);
                }
                yield this.restfulUtil.deleteFile(bucket, image);
                yield this.imageRepository.delete({ name, bucketId: bucket.id });
            }
            return { code: 200, message: '删除文件成功' };
        });
    }
};
__decorate([
    graphql_1.Query('downloadProcess'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], FileResolver.prototype, "downloadProcess", null);
__decorate([
    graphql_1.Mutation('uploadProcess'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], FileResolver.prototype, "uploadProcess", null);
__decorate([
    graphql_1.Query('one'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], FileResolver.prototype, "getFile", null);
__decorate([
    graphql_1.Query('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], FileResolver.prototype, "files", null);
__decorate([
    graphql_1.Mutation('deleteFile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, Object]),
    __metadata("design:returntype", Promise)
], FileResolver.prototype, "deleteFile", null);
FileResolver = __decorate([
    graphql_1.Resolver('File'),
    common_1.UseInterceptors(ExceptionInterceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(AuthUtil_1.AuthUtil)),
    __param(1, common_1.Inject(KindUtil_1.KindUtil)),
    __param(2, common_1.Inject(RestfulUtil_1.RestfulUtil)),
    __param(3, common_1.Inject(FileService_1.FileService)),
    __param(4, common_1.Inject(ConfigService_1.ConfigService)),
    __param(5, typeorm_2.InjectRepository(File_entity_1.File)),
    __param(6, typeorm_2.InjectRepository(Image_entity_1.Image)),
    __param(7, typeorm_2.InjectRepository(Bucket_entity_1.Bucket)),
    __metadata("design:paramtypes", [AuthUtil_1.AuthUtil,
        KindUtil_1.KindUtil,
        RestfulUtil_1.RestfulUtil,
        FileService_1.FileService,
        ConfigService_1.ConfigService,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], FileResolver);
exports.FileResolver = FileResolver;
