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
const crypto = require('crypto');
let AuthUtil = class AuthUtil {
    constructor() { }
    getHeaderAuth(bucket, method, url, date, md5) {
        return __awaiter(this, void 0, void 0, function* () {
            let ori = '';
            ori += method.toUpperCase() + '&';
            ori += url + '&';
            ori += date;
            if (md5 && md5 !== '') {
                ori += '&' + md5;
            }
            let signTemp = crypto.createHmac('sha1', bucket.password).update(ori).digest().toString('base64');
            return 'UPYUN ' + bucket.operator + ':' + signTemp;
        });
    }
    getBodyAuth(bucket, method, policy) {
        return __awaiter(this, void 0, void 0, function* () {
            let ori = '';
            ori += method.toUpperCase() + '&';
            ori += '/' + policy['bucket'] + '&';
            ori += policy.date + '&';
            ori += Buffer.from(JSON.stringify(policy)).toString('base64');
            if (policy['content-md5'] && policy['content-md5'] !== '') {
                ori += '&' + policy['content-md5'];
            }
            let signTemp = crypto.createHmac('sha1', bucket.password).update(ori).digest('base64');
            return 'UPYUN ' + bucket.operator + ':' + signTemp;
        });
    }
    getToken(bucket, url) {
        return __awaiter(this, void 0, void 0, function* () {
            let expireTime = Math.floor((+new Date()) / 1000) + bucket.token_expire;
            let str = bucket.token_secret_key + '&' + expireTime + '&' + url;
            let md5 = crypto.createHash('md5').update(str).digest('hex');
            let middle8 = md5.substring(12, 20);
            return middle8 + expireTime;
        });
    }
    notifyVerify(auth, bucket, method, url, date, contentMd5, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let rawBody = '';
            let keys = Object.keys(body);
            keys.forEach((key, index) => {
                if (body[key] && !isNaN(parseInt(body[key])) && key !== 'task_ids') {
                    body[key] = parseInt(body[key]);
                }
                rawBody += key + '=' + encodeURIComponent(body[key]);
                if (index < keys.length - 1) {
                    rawBody += '&';
                }
            });
            let genarateMd5 = crypto.createHash('md5').update(rawBody).digest('hex');
            if (genarateMd5 !== contentMd5) {
                return false;
            }
            let ori = '';
            ori += method.toUpperCase() + '&';
            ori += url + '&';
            ori += date + '&';
            ori += contentMd5;
            let localSign = crypto.createHmac('sha1', bucket.password).update(ori).digest('base64');
            let remoteSign = auth.substr(auth.lastIndexOf(':') + 1);
            if (localSign === remoteSign) {
                return true;
            }
            return false;
        });
    }
    taskNotifyVerify(auth, bucket, method, url, date, contentMd5, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let genarateMd5 = crypto.createHash('md5').update(JSON.stringify(body)).digest('hex');
            if (contentMd5 !== genarateMd5) {
                return false;
            }
            let ori = '';
            ori += method.toUpperCase() + '&';
            ori += url + '&';
            ori += date + '&';
            ori += contentMd5;
            let localSign = crypto.createHmac('sha1', bucket.password).update(ori).digest('base64');
            let remoteSign = auth.substr(auth.lastIndexOf(':') + 1);
            if (localSign === remoteSign) {
                return true;
            }
            return false;
        });
    }
};
AuthUtil = __decorate([
    common_1.Component(),
    __metadata("design:paramtypes", [])
], AuthUtil);
exports.AuthUtil = AuthUtil;
