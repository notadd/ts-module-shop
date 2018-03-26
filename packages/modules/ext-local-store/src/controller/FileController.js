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
const UpyunExceptionFilter_1 = require("../exception/UpyunExceptionFilter");
const typeorm_1 = require("typeorm");
const FileService_1 = require("../service/FileService");
const typeorm_2 = require("@nestjs/typeorm");
const RestfulUtil_1 = require("../util/RestfulUtil");
const Bucket_entity_1 = require("../model/Bucket.entity");
const Image_entity_1 = require("../model/Image.entity");
const File_entity_1 = require("../model/File.entity");
const KindUtil_1 = require("../util/KindUtil");
const AuthUtil_1 = require("../util/AuthUtil");
const path = require("path");
let FileController = class FileController {
    constructor(authUtil, kindUtil, restfulUtil, fileService, fileRepository, imageRepository, bucketRepository) {
        this.authUtil = authUtil;
        this.kindUtil = kindUtil;
        this.restfulUtil = restfulUtil;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.imageRepository = imageRepository;
        this.bucketRepository = bucketRepository;
    }
    asyncNotify(body, req, headers, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let content_type = headers['content-type'];
            let contentMd5 = headers['content-md5'];
            let auth = headers['authorization'];
            let date = headers['date'];
            console.log(body);
            if (content_type === 'application/x-www-form-urlencoded') {
                let code = +body.code;
                if (code !== 200) {
                    throw new common_1.HttpException('上传失败,返回200告诉又拍云不要再发送回调信息', 200);
                }
                let name = path.parse(body.url).name;
                let type = path.parse(body.url).ext.substr(1);
                let kind = this.kindUtil.getKind(type);
                let bucketName = body['ext-param'];
                let bucket = yield this.bucketRepository.findOne({ name: bucketName });
                if (!bucket) {
                    throw new common_1.HttpException('空间不存在，说明是内部错误,返回200告诉又拍云不要再发送回调信息', 200);
                }
                let pass = yield this.authUtil.notifyVerify(auth, bucket, 'POST', '/upyun/file/notify', date, contentMd5, body);
                if (!pass) {
                    throw new common_1.HttpException('验签失败,返回400告诉又拍云继续发送回调信息', 400);
                }
                if (kind === 'image') {
                    let image = new Image_entity_1.Image();
                    image.name = name;
                    image.type = type;
                    yield this.restfulUtil.deleteFile(bucket, image);
                }
                else {
                }
            }
            else if (content_type === 'application/json') {
                let code = body.status_code;
                if (code !== 200) {
                    throw new common_1.HttpException('预处理失败,返回200告诉又拍云不要再发送回调信息', 200);
                }
                let bucketName = body.bucket_name;
                let name = path.parse(body.imginfo.path).name;
                let type = path.parse(body.imginfo.path).ext.substr(1);
                let kind = this.kindUtil.getKind(type);
                let bucket = yield this.bucketRepository.findOne({ name: bucketName });
                let pass = yield this.authUtil.taskNotifyVerify(auth, bucket, 'POST', '/upyun/file/notify', date, contentMd5, body);
                if (!pass) {
                    throw new common_1.HttpException('验签失败,返回400告诉又拍云继续发送回调信息', 400);
                }
                yield this.fileService.postSaveTask(bucket, name, body, kind);
            }
            res.sendStatus(200);
            res.end();
            return;
        });
    }
};
__decorate([
    common_1.Post('notify'),
    __param(0, common_1.Body()), __param(1, common_1.Request()), __param(2, common_1.Headers()), __param(3, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "asyncNotify", null);
FileController = __decorate([
    common_1.Controller('upyun/file'),
    common_1.UseFilters(new UpyunExceptionFilter_1.UpyunExceptionFilter()),
    __param(0, common_1.Inject(AuthUtil_1.AuthUtil)),
    __param(1, common_1.Inject(KindUtil_1.KindUtil)),
    __param(2, common_1.Inject(RestfulUtil_1.RestfulUtil)),
    __param(3, common_1.Inject(FileService_1.FileService)),
    __param(4, typeorm_2.InjectRepository(File_entity_1.File)),
    __param(5, typeorm_2.InjectRepository(Image_entity_1.Image)),
    __param(6, typeorm_2.InjectRepository(Bucket_entity_1.Bucket)),
    __metadata("design:paramtypes", [AuthUtil_1.AuthUtil,
        KindUtil_1.KindUtil,
        RestfulUtil_1.RestfulUtil,
        FileService_1.FileService,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], FileController);
exports.FileController = FileController;
