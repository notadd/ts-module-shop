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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let TokenUtil = class TokenUtil {
    constructor() { }
    getToken(url, bucket) {
        if (bucket.public_or_private === 'public') {
            throw new Error('公有空间不需要token');
        }
        let expire = Math.floor((+new Date()) / 1000) + bucket.token_expire;
        let str = url + expire + bucket.token_secret_key;
        let md5 = crypto.createHash('md5').update(str).digest('hex');
        return md5 + expire;
    }
    verify(url, bucket, token) {
        let expire = parseInt(token.substring(32));
        let md5 = token.substring(0, 32);
        let str = url + expire + bucket.token_secret_key;
        let generateMd5 = crypto.createHash('md5').update(str).digest('hex');
        if (md5 !== generateMd5) {
            throw new common_1.HttpException('token验证错误', 413);
        }
        let now = Math.floor(+new Date() / 1000);
        if (now > expire) {
            throw new common_1.HttpException('token超时', 414);
        }
    }
};
TokenUtil = __decorate([
    common_1.Component(),
    __metadata("design:paramtypes", [])
], TokenUtil);
exports.TokenUtil = TokenUtil;
