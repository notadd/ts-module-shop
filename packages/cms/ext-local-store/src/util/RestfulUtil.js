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
const ProcessStringUtil_1 = require("./ProcessStringUtil");
const PromiseUtil_1 = require("./PromiseUtil");
const AuthUtil_1 = require("../util/AuthUtil");
const request = require("request");
const mime = require("mime");
const fs = require("fs");
let RestfulUtil = class RestfulUtil {
    constructor(authUtil, promiseUtil, processStringUtil) {
        this.authUtil = authUtil;
        this.promiseUtil = promiseUtil;
        this.processStringUtil = processStringUtil;
        this.apihost = 'https://v0.api.upyun.com';
    }
    uploadFile(bucket, file, uploadFile, imagePreProcessInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentMd5 = file.md5;
            let save_key = '/' + bucket.directory + '/' + file.name + '.' + file.type;
            let requestUrl = this.apihost + '/' + bucket.name + save_key;
            let url = '/' + bucket.name + save_key;
            let date = new Date(+new Date() + bucket.request_expire * 1000).toUTCString();
            let Authorization = yield this.authUtil.getHeaderAuth(bucket, 'PUT', url, date, contentMd5);
            let format = bucket.image_config.format || 'raw';
            let x_gmkerl_thumb = this.processStringUtil.makeImageProcessString(bucket, imagePreProcessInfo);
            if (format === 'raw') {
                x_gmkerl_thumb += '/scale/100';
            }
            else if (format === 'webp_damage') {
                x_gmkerl_thumb += '/format/webp/strip/true';
            }
            else {
                x_gmkerl_thumb += '/format/webp/lossless/true/strip/true';
            }
            let height, width, frames;
            yield this.promiseUtil.do((resolve, reject) => {
                fs.createReadStream(uploadFile.path).pipe(request.put({
                    url: requestUrl,
                    headers: {
                        'Content-Type': mime.getType(file.name),
                        'Content-Length': file.size,
                        'Content-MD5': contentMd5,
                        Authorization,
                        Date: date,
                        'x-gmkerl-thumb': x_gmkerl_thumb
                    }
                }, (err, res, body) => {
                    if (err) {
                        reject(new common_1.HttpException('文件上传失败,网络错误', 402));
                        return;
                    }
                    if (res.statusCode === 200) {
                        width = res.headers['x-upyun-width'];
                        height = res.headers['x-upyun-height'];
                        frames = res.headers['x-upyun-frames'];
                        resolve();
                        return;
                    }
                    if (body) {
                        try {
                            let { msg, code, id } = JSON.parse(body);
                            reject(new common_1.HttpException(msg, code));
                        }
                        catch (err) {
                            reject(new common_1.HttpException('响应体解析错误', 402));
                        }
                    }
                    else {
                        reject(new common_1.HttpException('响应体不存在', 402));
                    }
                    return;
                }));
            });
            return { width, height, frames };
        });
    }
    createDirectory(bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestUrl = this.apihost + '/' + bucket.name + '/' + bucket.directory;
            let url = '/' + bucket.name + '/' + bucket.directory;
            let date = new Date(+new Date() + bucket.request_expire * 1000).toUTCString();
            let Authorization = yield this.authUtil.getHeaderAuth(bucket, 'POST', url, date, null);
            yield this.promiseUtil.do((resolve, reject) => {
                request.post({
                    url: requestUrl,
                    headers: {
                        Authorization,
                        Date: date,
                        folder: true
                    }
                }, (err, res, body) => {
                    if (err) {
                        reject(new common_1.HttpException('目录创建失败，网络错误', 402));
                        return;
                    }
                    if (res.statusCode === 200) {
                        resolve();
                        return;
                    }
                    if (body) {
                        try {
                            let { msg, code, id } = JSON.parse(body);
                            reject(new common_1.HttpException(msg, code));
                        }
                        catch (err) {
                            reject(new common_1.HttpException('响应体解析错误', 402));
                        }
                    }
                    else {
                        reject(new common_1.HttpException('响应体不存在', 402));
                    }
                    return;
                });
            });
            return;
        });
    }
    deleteFile(bucket, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let save_key = '/' + bucket.directory + '/' + file.name + '.' + file.type;
            let requestUrl = this.apihost + '/' + bucket.name + save_key;
            let url = '/' + bucket.name + save_key;
            let date = new Date(+new Date() + bucket.request_expire * 1000).toUTCString();
            let Authorization = yield this.authUtil.getHeaderAuth(bucket, 'DELETE', url, date, '');
            yield this.promiseUtil.do((resolve, reject) => {
                request.delete({
                    url: requestUrl,
                    headers: {
                        Authorization,
                        Date: date
                    }
                }, (err, res, body) => {
                    if (err) {
                        reject(new common_1.HttpException('删除文件失败', 402));
                        return;
                    }
                    if (res.statusCode == 200) {
                        resolve();
                        return;
                    }
                    if (body) {
                        try {
                            let { msg, code, id } = JSON.parse(body);
                            reject(new common_1.HttpException(msg, code));
                        }
                        catch (err) {
                            reject(new common_1.HttpException('响应体解析错误', 402));
                        }
                    }
                    else {
                        reject(new common_1.HttpException('响应体不存在', 402));
                    }
                    return;
                });
            });
            return;
        });
    }
    getFileInfo(bucket, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let save_key = '/' + bucket.directory + '/' + file.name + '.' + file.type;
            let requestUrl = this.apihost + '/' + bucket.name + save_key;
            let url = '/' + bucket.name + save_key;
            let date = new Date(+new Date() + bucket.request_expire * 1000).toUTCString();
            let Authorization = yield this.authUtil.getHeaderAuth(bucket, 'HEAD', url, date, '');
            let file_size, file_date, file_md5;
            yield this.promiseUtil.do((resolve, reject) => {
                request.head({
                    url: requestUrl,
                    headers: {
                        Authorization,
                        Date: date
                    }
                }, (err, res, body) => {
                    if (err) {
                        reject(new common_1.HttpException('获取文件信息失败', 402));
                        return;
                    }
                    if (res.statusCode == 200) {
                        file_size = +res.headers['x-upyun-file-size'];
                        file_date = +res.headers['x-upyun-file-date'];
                        file_md5 = res.headers['content-md5'];
                        resolve();
                        return;
                    }
                    if (body) {
                        try {
                            let { msg, code, id } = JSON.parse(body);
                            reject(new common_1.HttpException(msg, code));
                        }
                        catch (err) {
                            reject(new common_1.HttpException('响应体解析错误', 402));
                        }
                    }
                    else {
                        reject(new common_1.HttpException('响应体不存在', 402));
                    }
                    return;
                });
            });
            return { file_size, file_date, file_md5 };
        });
    }
    getFileList(bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            let save_key = '/' + bucket.directory;
            let requestUrl = this.apihost + '/' + bucket.name + save_key;
            let url = '/' + bucket.name + save_key;
            let date = new Date(+new Date() + bucket.request_expire * 1000).toUTCString();
            let Authorization = yield this.authUtil.getHeaderAuth(bucket, 'GET', url, date, '');
            let info;
            yield this.promiseUtil.do((resolve, reject) => {
                request.get({
                    url: requestUrl,
                    headers: {
                        Authorization,
                        Date: date
                    }
                }, (err, res, body) => {
                    if (err) {
                        reject(new common_1.HttpException('获取文件信息失败', 402));
                        return;
                    }
                    if (res.statusCode == 200) {
                        info = body.split('\n').map((value, index, raw) => {
                            let temp = value.split('\t');
                            return {
                                name: temp[0],
                                isDirectory: (temp[1] === 'N' ? false : true),
                                size: parseInt(temp[2]),
                                timestamp: parseInt(temp[3])
                            };
                        });
                        resolve();
                        return;
                    }
                    reject(new common_1.HttpException('获取文件列表失败', 402));
                    return;
                });
            });
            return info;
        });
    }
};
RestfulUtil = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject(AuthUtil_1.AuthUtil)),
    __param(1, common_1.Inject(PromiseUtil_1.PromiseUtil)),
    __param(2, common_1.Inject(ProcessStringUtil_1.ProcessStringUtil)),
    __metadata("design:paramtypes", [AuthUtil_1.AuthUtil,
        PromiseUtil_1.PromiseUtil,
        ProcessStringUtil_1.ProcessStringUtil])
], RestfulUtil);
exports.RestfulUtil = RestfulUtil;
