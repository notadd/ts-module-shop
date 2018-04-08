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
const ProcessStringUtil_1 = require("../util/ProcessStringUtil");
const typeorm_1 = require("@nestjs/typeorm");
const RestfulUtil_1 = require("../util/RestfulUtil");
const Bucket_entity_1 = require("../model/Bucket.entity");
const Audio_entity_1 = require("../model/Audio.entity");
const Video_entity_1 = require("../model/Video.entity");
const Image_entity_1 = require("../model/Image.entity");
const File_entity_1 = require("../model/File.entity");
const KindUtil_1 = require("../util/KindUtil");
const AuthUtil_1 = require("../util/AuthUtil");
const typeorm_2 = require("typeorm");
let FileService = class FileService {
    constructor(authUtil, kindUtil, restfulUtil, processStringUtil, fileRepository, imageRepository, audioRepository, videoRepository, bucketRepository) {
        this.authUtil = authUtil;
        this.kindUtil = kindUtil;
        this.restfulUtil = restfulUtil;
        this.processStringUtil = processStringUtil;
        this.fileRepository = fileRepository;
        this.imageRepository = imageRepository;
        this.audioRepository = audioRepository;
        this.videoRepository = videoRepository;
        this.bucketRepository = bucketRepository;
    }
    makePolicy(data, policy, bucket, body, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let { md5, contentSecret, contentName } = body;
            if (contentSecret) {
                policy['content-secret'] = contentSecret;
            }
            policy['bucket'] = bucket.name;
            policy['ext-param'] += bucket.name;
            data['url'] += '/' + bucket.name;
            let type = file.type || '';
            let kind = this.kindUtil.getKind(type);
            policy['save-key'] += '/' + bucket.directory + '/' + md5 + '_' + (+new Date()) + '.' + type;
            policy['expiration'] = Math.floor((+new Date()) / 1000) + bucket.request_expire;
            policy['date'] = new Date(+new Date() + bucket.request_expire * 1000).toUTCString();
            if (kind === 'image') {
                let obj = {
                    'name': 'thumb',
                    'x-gmkerl-thumb': '',
                    'save_as': '',
                    'notify_url': policy['notify-url']
                };
                let format = bucket.image_config.format || 'raw';
                if (format == 'raw') {
                    obj['x-gmkerl-thumb'] = this.processStringUtil.makeImageProcessString(bucket, body.imagePreProcessInfo) + '/scale/100';
                    obj['save_as'] = '/' + bucket.directory + '/' + file.name + '.' + file.type;
                    policy['apps'] = [obj];
                }
                else if (format == 'webp_damage') {
                    obj['x-gmkerl-thumb'] = this.processStringUtil.makeImageProcessString(bucket, body.imagePreProcessInfo) + '/format/webp/strip/true';
                    obj['save_as'] = '/' + bucket.directory + '/' + file.name + '.' + 'webp';
                    policy['apps'] = [obj];
                }
                else if (format == 'webp_undamage') {
                    obj['x-gmkerl-thumb'] = this.processStringUtil.makeImageProcessString(bucket, body.imagePreProcessInfo) + '/format/webp/lossless/true/strip/true';
                    obj['save_as'] = '/' + bucket.directory + '/' + file.name + '.' + 'webp';
                    policy['apps'] = [obj];
                }
                else {
                    throw new Error('格式配置不正确，应该不能发生');
                }
            }
            else {
            }
            data.form.policy = Buffer.from(JSON.stringify(policy)).toString('base64');
            let method = data.method;
            data.form.authorization = yield this.authUtil.getBodyAuth(bucket, method, policy);
            return;
        });
    }
    preSaveFile(bucket, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let { md5, contentName, contentSecret, tags } = body;
            let type = contentName.substr(contentName.lastIndexOf('.') + 1).toLowerCase();
            let kind = this.kindUtil.getKind(type);
            if (kind === 'image') {
                let image = new Image_entity_1.Image();
                image.raw_name = contentName;
                image.name = md5 + '_' + (+new Date());
                image.md5 = md5;
                image.tags = tags;
                image.type = type;
                image.status = 'pre';
                image.content_secret = contentSecret || null;
                image.bucket = bucket;
                try {
                    yield this.imageRepository.save(image);
                }
                catch (err) {
                    throw new common_1.HttpException('图片预保存失败', 403);
                }
                return image;
            }
            else {
            }
        });
    }
    postSaveTask(bucket, name, body, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            if (kind === 'image') {
                let image = yield this.imageRepository.findOne({ name, bucketId: bucket.id, status: 'pre' });
                if (!image) {
                    return;
                }
                image.width = body.imginfo['width'],
                    image.height = body.imginfo['height'],
                    image.type = body.imginfo['type'].toLowerCase(),
                    image.frames = body.imginfo['frames'],
                    image.status = 'post';
                let { file_size, file_md5 } = yield this.restfulUtil.getFileInfo(bucket, image);
                image.size = file_size;
                image.md5 = file_md5;
                try {
                    yield this.imageRepository.updateById(image.id, image);
                }
                catch (err) {
                    throw new common_1.HttpException('更新预保存图片失败', 403);
                }
            }
            else {
                throw new Error('kind不正确');
            }
            return;
        });
    }
    makeUrl(bucket, file, body, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = '/' + bucket.directory + '/' + file.name + '.' + file.type;
            url += '!';
            if (file.content_secret) {
                url += file.content_secret;
            }
            if (kind === 'image') {
                url += this.processStringUtil.makeImageProcessString(bucket, body.imagePostProcessInfo);
            }
            if (bucket.public_or_private == 'private') {
                url += '?_upt=' + (yield this.authUtil.getToken(bucket, url));
            }
            url = bucket.base_url.concat(url);
            return url;
        });
    }
    getAll(data, bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            data.files = yield bucket.files;
            data.images = yield bucket.images;
            data.audios = yield bucket.audios;
            data.videos = yield bucket.videos;
            data.documents = yield bucket.documents;
            let addUrl = function (value) {
                return __awaiter(this, void 0, void 0, function* () {
                    value.url = '/' + bucket.directory + '/' + value.name + '.' + value.type;
                    if (value.content_secret) {
                        value.url += '!' + value.content_secret;
                    }
                    if (bucket.public_or_private === 'private') {
                        value.url += '?_upt=' + (yield this.authUtil.getToken(bucket, value.url));
                    }
                });
            };
            yield data.files.forEach(addUrl, this);
            yield data.images.forEach(addUrl, this);
            yield data.audios.forEach(addUrl, this);
            yield data.videos.forEach(addUrl, this);
            yield data.documents.forEach(addUrl, this);
            return;
        });
    }
};
FileService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject(AuthUtil_1.AuthUtil)),
    __param(1, common_1.Inject(KindUtil_1.KindUtil)),
    __param(2, common_1.Inject(RestfulUtil_1.RestfulUtil)),
    __param(3, common_1.Inject(ProcessStringUtil_1.ProcessStringUtil)),
    __param(4, typeorm_1.InjectRepository(File_entity_1.File)),
    __param(5, typeorm_1.InjectRepository(Image_entity_1.Image)),
    __param(6, typeorm_1.InjectRepository(Audio_entity_1.Audio)),
    __param(7, typeorm_1.InjectRepository(Video_entity_1.Video)),
    __param(8, typeorm_1.InjectRepository(Bucket_entity_1.Bucket)),
    __metadata("design:paramtypes", [AuthUtil_1.AuthUtil,
        KindUtil_1.KindUtil,
        RestfulUtil_1.RestfulUtil,
        ProcessStringUtil_1.ProcessStringUtil,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FileService);
exports.FileService = FileService;
