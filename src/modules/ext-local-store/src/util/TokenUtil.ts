import { Component, HttpException } from '@nestjs/common';
import * as crypto from 'crypto'
import { Bucket } from '../model/Bucket.entity'

@Component()
export class TokenUtil {

    constructor() { }

    getToken(url: string, bucket: Bucket): string {
        if (bucket.public_or_private === 'public') {
            throw new Error('公有空间不需要token')
        }
        //获取超时GMT时间戳，单位为秒
        let expire: number = Math.floor((+new Date()) / 1000) + bucket.token_expire
        //拼接要签名的字符串
        let str = url + expire + bucket.token_secret_key
        let md5 = crypto.createHash('md5').update(str).digest('hex')
        return md5 + expire
    }

    verify(url: string, bucket: Bucket, token: string):void{
        let expire: number = parseInt(token.substring(32))
        let md5: string = token.substring(0, 32)
        let str = url + expire + bucket.token_secret_key
        let generateMd5 = crypto.createHash('md5').update(str).digest('hex')
        if (md5 !== generateMd5) {
            throw new HttpException('token验证错误',413)
        }
        //当前时间
        let now = Math.floor(+new Date() / 1000)
        if (now > expire) {
            throw new HttpException('token超时',414)
        }
    }
}