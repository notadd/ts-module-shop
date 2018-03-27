import { Component, HttpException, Inject } from '@nestjs/common';
import { PromiseUtil } from './PromiseUtil';
import * as fs from 'fs'


/* 异步操作文件的封装工具类 */
@Component()
export class FileUtil {

    constructor(
        @Inject(PromiseUtil) private readonly promiseUtil: PromiseUtil
    ) { }

    async write(path: string, buffer: Buffer): Promise<void> {
        await this.promiseUtil.do((resolver, reject) => {
            fs.writeFile(path, buffer, (err) => {
                if (err) {
                    reject(new HttpException('文件写入磁盘错误:' + err.toString(), 406))
                }
                resolver()
            })
        })
    }

    async read(path: string): Promise<Buffer> {
        let result: Buffer
        await this.promiseUtil.do((resolver, reject) => {
            fs.readFile(path, (err, buffer) => {
                if (err) {
                    reject(new HttpException('读取文件错误:' + err.toString(), 406))
                }
                result = buffer
                resolver()
            })
        })
        return result
    }

    async delete(path: string): Promise<void> {
        await this.promiseUtil.do((resolver, reject) => {
            fs.unlink(path, (err) => {
                if (err) {
                    reject(new HttpException('文件删除错误:' + err.toString(), 406))
                }
                resolver()
            })
        })
    }

    async deleteIfExist(path: string): Promise<void> {
        if (fs.existsSync(path)) {
            await this.promiseUtil.do((resolver, reject) => {
                fs.unlink(path, (err) => {
                    if (err) {
                        reject(new HttpException('文件删除错误:' + err.toString(), 406))
                    }
                    resolver()
                })
            })
        }
    }

    //获取文件状态，一般只有一个size能言用
    async size(path: string): Promise<number> {
        if (fs.existsSync(path)) {
            let size
            await this.promiseUtil.do((resolver, reject) => {
                fs.stat(path, (err, stats) => {
                    if (err) {
                        reject(new HttpException('获取文件状态错误:' + err.toString(), 406))
                    }
                    size = stats.size
                    resolver()
                })
            })
            return size
        } else {
            return null
        }
    }

    exist(path: string): boolean {
        return fs.existsSync(path)
    }

    async mkdir(path: string): Promise<void> {
        await this.promiseUtil.do((resolver, reject) => {
            fs.mkdir(path, (err) => {
                if (err) {
                    reject(new HttpException('创建目录错误:' + err.toString(), 406))
                }
                resolver()
            })
        })
    }
} 