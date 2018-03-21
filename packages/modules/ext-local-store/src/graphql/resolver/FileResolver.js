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
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const FileService_1 = require("../../service/FileService");
const common_1 = require("@nestjs/common");
const TokenUtil_1 = require("../../util/TokenUtil");
const KindUtil_1 = require("../../util/KindUtil");
const FileUtil_1 = require("../../util/FileUtil");
const http_1 = require("http");
const path = require("path");
let FileResolver = class FileResolver {
    constructor(fileUtil, kindUtil, tokenUtil, fileService, fileRepository, imageRepository, bucketRepository) {
        this.fileUtil = fileUtil;
        this.kindUtil = kindUtil;
        this.tokenUtil = tokenUtil;
        this.fileService = fileService;
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
                    bucketName: '',
                    fileName: ''
                },
                url: req.protocol + '://' + req.get('host') + '/local/file/download'
            };
            try {
                let { bucketName, name, type } = body;
                if (!bucketName || !name || !type) {
                    throw new common_1.HttpException('缺少参数', 400);
                }
                let bucket = yield this.bucketRepository.findOne({ name: bucketName });
                if (!bucket) {
                    throw new common_1.HttpException('指定空间' + bucketName + '不存在', 401);
                }
                let kind;
                let file;
                if (this.kindUtil.isImage(type)) {
                    file = yield this.imageRepository.findOne({ name, type, bucketId: bucket.id });
                }
                else {
                }
                if (!file) {
                    throw new common_1.HttpException('指定文件' + name + '不存在', 404);
                }
                data.headers.bucketName = bucket.name;
                data.headers.fileName = file.name + '.' + file.type;
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
    uploadProcess(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: '',
                method: 'post',
                url: req.protocol + '://' + req.get('host') + '/local/file/upload',
                baseUrl: req.protocol + '://' + req.get('host'),
                form: {
                    md5: '',
                    rawName: '',
                    bucketName: '',
                    tagsString: null,
                    contentSecret: null,
                    imagePreProcessString: null,
                }
            };
            try {
                let { bucketName, md5, contentName, contentSecret, tags, imagePreProcessInfo } = body;
                if (!bucketName || !contentName) {
                    throw new common_1.HttpException('缺少参数', 400);
                }
                let bucket = yield this.bucketRepository.findOne({ name: bucketName });
                if (!bucket) {
                    throw new common_1.HttpException('指定空间' + bucketName + '不存在', 401);
                }
                data.form.md5 = md5;
                data.form.rawName = contentName;
                data.form.bucketName = bucket.name;
                data.form.contentSecret = contentSecret;
                try {
                    data.form.tagsString = JSON.stringify(tags);
                    data.form.imagePreProcessString = JSON.stringify(imagePreProcessInfo);
                }
                catch (err) {
                    throw new common_1.HttpException('JSON解析错误' + err.toString(), 409);
                }
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
    getOne(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: "获取文件url成功",
                url: req.protocol + '://' + req.get('host') + '/local/file/visit'
            };
            try {
                let { bucketName, name, type, imagePostProcessInfo } = body;
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
                if (kind === 'image') {
                    let image = yield this.imageRepository.findOne({ name, bucketId: bucket.id });
                    if (!image) {
                        throw new common_1.HttpException('指定图片' + name + '.' + type + '不存在', 404);
                    }
                    data.url += '/' + bucketName + '/' + name + '.' + type;
                    if (imagePostProcessInfo) {
                        data.url += '?imagePostProcessString=' + JSON.stringify(imagePostProcessInfo);
                        if (bucket.public_or_private === 'private') {
                            data.url += '&token=' + this.tokenUtil.getToken(data.url, bucket);
                        }
                    }
                    else {
                        if (bucket.public_or_private === 'private') {
                            data.url += '?token=' + this.tokenUtil.getToken(data.url, bucket);
                        }
                    }
                }
                else {
                }
                console.log(data.url);
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
    files(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: '获取空间下所有文件成功',
                baseUrl: req.protocol + '://' + req.get('host') + '/local/file/visit',
                files: [],
                images: [],
                audios: [],
                videos: [],
                documents: []
            };
            try {
                let { bucketName } = body;
                if (!bucketName) {
                    throw new common_1.HttpException('缺少参数', 400);
                }
                let bucket = yield this.bucketRepository.findOne({ name: bucketName });
                if (!bucket) {
                    throw new common_1.HttpException('指定空间' + bucketName + '不存在', 401);
                }
                yield this.fileService.getAll(data, bucket);
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
    deleteFile(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                code: 200,
                message: '删除成功'
            };
            try {
                let { bucketName, type, name } = body;
                if (!bucketName || !name || !type) {
                    throw new common_1.HttpException('缺少参数', 400);
                }
                let bucket = yield this.bucketRepository.findOne({ name: bucketName });
                if (!bucket) {
                    throw new common_1.HttpException('指定空间' + bucketName + '不存在', 401);
                }
                let kind = this.kindUtil.getKind(type);
                if (kind === 'image') {
                    let image = yield this.imageRepository.findOne({ name, bucketId: bucket.id });
                    if (!image) {
                        throw new common_1.HttpException('文件' + name + '不存在于数据库中', 404);
                    }
                    yield this.imageRepository.delete({ name, bucketId: bucket.id });
                }
                else {
                }
                let realPath = path.resolve(__dirname, '../../', 'store', bucketName, name + '.' + type);
                if (!this.fileUtil.exist(realPath)) {
                    throw new common_1.HttpException('要删除的文件不存在', 404);
                }
                yield this.fileUtil.delete(realPath);
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
    graphql_1.Query('downloadProcess'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileResolver.prototype, "downloadProcess", null);
__decorate([
    graphql_1.Mutation('uploadProcess'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileResolver.prototype, "uploadProcess", null);
__decorate([
    graphql_1.Query('one'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileResolver.prototype, "getOne", null);
__decorate([
    graphql_1.Query('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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
    __param(0, common_1.Inject(FileUtil_1.FileUtil)),
    __param(1, common_1.Inject(KindUtil_1.KindUtil)),
    __param(2, common_1.Inject(TokenUtil_1.TokenUtil)),
    __param(3, common_1.Inject(FileService_1.FileService)),
    __param(4, common_1.Inject('LocalModule.FileRepository')),
    __param(5, common_1.Inject('LocalModule.ImageRepository')),
    __param(6, common_1.Inject('LocalModule.BucketRepository')),
    __metadata("design:paramtypes", [FileUtil_1.FileUtil,
        KindUtil_1.KindUtil,
        TokenUtil_1.TokenUtil,
        FileService_1.FileService,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], FileResolver);
exports.FileResolver = FileResolver;
