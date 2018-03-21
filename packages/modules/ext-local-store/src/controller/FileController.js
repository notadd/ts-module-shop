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
const LocalExceptionFilter_1 = require("../exception/LocalExceptionFilter");
const DownloadParamGuard_1 = require("../guard/DownloadParamGuard");
const UploadParamGuard_1 = require("../guard/UploadParamGuard");
const ImageProcessUtil_1 = require("../util/ImageProcessUtil");
const typeorm_1 = require("typeorm");
const FileService_1 = require("../service/FileService");
const TokenUtil_1 = require("../util/TokenUtil");
const FileUtil_1 = require("../util/FileUtil");
const KindUtil_1 = require("../util/KindUtil");
const crypto = require("crypto");
const path = require("path");
const mime = require("mime");
let FileController = class FileController {
    constructor(fileUtil, kindUtil, tokenUtil, fileService, imageProcessUtil, fileRepository, imageRepository, bucketRepository) {
        this.fileUtil = fileUtil;
        this.kindUtil = kindUtil;
        this.tokenUtil = tokenUtil;
        this.fileService = fileService;
        this.imageProcessUtil = imageProcessUtil;
        this.fileRepository = fileRepository;
        this.imageRepository = imageRepository;
        this.bucketRepository = bucketRepository;
    }
    download(headers, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { bucketName, fileName } = headers;
            let realPath = path.resolve(__dirname, '../', 'store', bucketName, fileName);
            if (!this.fileUtil.exist(realPath)) {
                throw new common_1.HttpException('请求下载的文件不存在', 404);
            }
            let buffer = yield this.fileUtil.read(realPath);
            res.setHeader('Content-Type', mime.getType(fileName));
            res.setHeader('Content-Length', Buffer.byteLength(buffer));
            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
            res.end(buffer);
            return;
        });
    }
    upload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { uploadForm: obj, uploadFile: file } = body;
            let url;
            try {
                let bucket = yield this.bucketRepository.createQueryBuilder("bucket")
                    .leftJoinAndSelect("bucket.image_config", "image_config")
                    .leftJoinAndSelect("bucket.audio_config", "audio_config")
                    .leftJoinAndSelect("bucket.video_config", "video_config")
                    .where("bucket.name = :name", { name: obj.bucketName })
                    .getOne();
                if (!bucket) {
                    throw new common_1.HttpException('指定空间' + obj.bucketName + '不存在', 401);
                }
                if (file.name !== obj.rawName) {
                    throw new common_1.HttpException('上传文件名' + file.name + '与请求头中文件名' + obj.fileName + '不符', 411);
                }
                let { imagePreProcessString, contentSecret, tagsString, md5 } = obj;
                let buffer = yield this.fileUtil.read(file.path);
                if (!(crypto.createHash('md5').update(buffer).digest('hex') === md5)) {
                    throw new common_1.HttpException('文件md5校验失败', 411);
                }
                url = yield this.fileService.saveUploadFile(bucket, file, obj);
            }
            catch (err) {
                throw err;
            }
            finally {
                yield this.fileUtil.delete(file.path);
            }
            return {
                code: 200,
                message: '上传文件成功',
                url
            };
        });
    }
    visit(param, query, res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            let { bucketName, fileName } = param;
            let { imagePostProcessString, token } = query;
            let realPath = path.resolve(__dirname, '../', 'store', bucketName, fileName);
            if (!this.fileUtil.exist(realPath)) {
                throw new common_1.HttpException('指定文件不存在', 404);
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
            if (bucket.public_or_private === 'private') {
                if (!token) {
                    throw new common_1.HttpException('访问私有空间文件需要token', 412);
                }
                let fullUrl = decodeURI(req.protocol + '://' + req.get('host') + req.originalUrl);
                if (imagePostProcessString) {
                    fullUrl = fullUrl.substring(0, fullUrl.lastIndexOf('&token='));
                }
                else {
                    fullUrl = fullUrl.substring(0, fullUrl.lastIndexOf('?token='));
                }
                this.tokenUtil.verify(fullUrl, bucket, token);
            }
            let imagePostProcessInfo;
            if (imagePostProcessString) {
                try {
                    imagePostProcessInfo = JSON.parse(imagePostProcessString);
                }
                catch (err) {
                    throw new common_1.HttpException('JSON解析错误:' + err.toString(), 409);
                }
            }
            let type = fileName.substring(fileName.lastIndexOf('.') + 1);
            let kind = this.kindUtil.getKind(type);
            if (kind === 'image') {
                let buffer = yield this.imageProcessUtil.processAndOutput(bucket, realPath, imagePostProcessInfo);
                let metadata = yield this.imageProcessUtil.getMetadata(buffer);
                res.setHeader('Content-Type', mime.getType(metadata.format));
                if (bucket.public_or_private === 'private') {
                    res.setHeader('Cache-Control', ['no-store', 'no-cache']);
                }
                res.setHeader('Content-Disposition', 'inline');
                res.end(buffer);
            }
            else {
            }
        });
    }
};
__decorate([
    common_1.Get('/download'),
    common_1.UseGuards(DownloadParamGuard_1.DownloadParamGuard),
    __param(0, common_1.Headers()), __param(1, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "download", null);
__decorate([
    common_1.Post('/upload'),
    common_1.UseGuards(UploadParamGuard_1.UploadParamGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "upload", null);
__decorate([
    common_1.Get('/visit/:bucketName/:fileName'),
    __param(0, common_1.Param()), __param(1, common_1.Query()), __param(2, common_1.Response()), __param(3, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "visit", null);
FileController = __decorate([
    common_1.Controller('local/file'),
    common_1.UseFilters(new LocalExceptionFilter_1.LocalExceptionFilter()),
    __param(0, common_1.Inject(FileUtil_1.FileUtil)),
    __param(1, common_1.Inject(KindUtil_1.KindUtil)),
    __param(2, common_1.Inject(TokenUtil_1.TokenUtil)),
    __param(3, common_1.Inject(FileService_1.FileService)),
    __param(4, common_1.Inject(ImageProcessUtil_1.ImageProcessUtil)),
    __param(5, common_1.Inject('LocalModule.FileRepository')),
    __param(6, common_1.Inject('LocalModule.ImageRepository')),
    __param(7, common_1.Inject('LocalModule.BucketRepository')),
    __metadata("design:paramtypes", [FileUtil_1.FileUtil,
        KindUtil_1.KindUtil,
        TokenUtil_1.TokenUtil,
        FileService_1.FileService,
        ImageProcessUtil_1.ImageProcessUtil,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], FileController);
exports.FileController = FileController;
