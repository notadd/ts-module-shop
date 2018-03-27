import { ImagePostProcessInfo, ImagePreProcessInfo } from '../interface/file/ImageProcessInfo';
import { Component, Inject, HttpException } from '@nestjs/common';
import { ProcessStringUtil } from './ProcessStringUtil';
import { Document } from '../model/Document.entity';
import { Bucket } from '../model/Bucket.entity';
import { Audio } from '../model/Audio.entity';
import { Video } from '../model/Video.entity';
import { Image } from '../model/Image.entity';
import { File } from '../model/File.entity';
import { PromiseUtil } from './PromiseUtil';
import { AuthUtil } from '../util/AuthUtil';
import * as request from 'request';
import * as crypto from 'crypto';
import * as mime from 'mime';
import * as fs from 'fs';


/* 包含了restfulAPI的各种功能 
   删除文件、创建目录、删除目录、获取文件信息、获取目录文件列表、获取服务使用量
*/
@Component()
export class RestfulUtil {
  private readonly apihost = 'http://v0.api.upyun.com'
  constructor(
    @Inject(AuthUtil) private readonly authUtil: AuthUtil,
    @Inject(PromiseUtil) private readonly promiseUtil: PromiseUtil,
    @Inject(ProcessStringUtil) private readonly processStringUtil: ProcessStringUtil
  ) { }

  //上传文件，其中文件信息来自于formidable解析得到的File对象
  async uploadFile(bucket: Bucket, file: File | Image | Video | Audio | Document, uploadFile: any, imagePreProcessInfo: ImagePreProcessInfo): Promise<{ width: number, height: number, frames: number }> {
    let contentMd5 = file.md5
    let save_key = '/' + bucket.directory + '/' + file.name + '.' + file.type
    let requestUrl = this.apihost + '/' + bucket.name + save_key
    let url = '/' + bucket.name + save_key
    let date: string = new Date(+new Date() + bucket.request_expire * 1000).toUTCString()
    let Authorization = await this.authUtil.getHeaderAuth(bucket, 'PUT', url, date, contentMd5)
    let format = bucket.image_config.format || 'raw'
    let x_gmkerl_thumb = this.processStringUtil.makeImageProcessString(bucket,imagePreProcessInfo)
    if (format === 'raw') {
      x_gmkerl_thumb += '/scale/100'
    } else if (format === 'webp_damage') {
      x_gmkerl_thumb += '/format/webp/strip/true'
    } else {
      x_gmkerl_thumb += '/format/webp/lossless/true/strip/true'
    }
    let height, width, frames
    await this.promiseUtil.do((resolve, reject) => {
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
          reject(new HttpException('文件上传失败,网络错误', 402))
          return
        }
        if (res.statusCode === 200) {
          width = res.headers['x-upyun-width']
          height = res.headers['x-upyun-height']
          frames = res.headers['x-upyun-frames']
          resolve()
          return
        }
        if (body) {
          try {
            let { msg, code, id } = JSON.parse(body)
            reject(new HttpException(msg, code))
          } catch (err) {
            reject(new HttpException('响应体解析错误', 402))
          }
        } else {
          reject(new HttpException('响应体不存在', 402))
        }
        return
      }))
    })
    return { width, height, frames }
  }


  /*创建指定空间里的指定目录，空间下唯一目录在配置中指定 
      @Param bucket：目录所属空间
  */
  async createDirectory(bucket: Bucket): Promise<void> {
    let requestUrl = this.apihost + '/' + bucket.name + '/' + bucket.directory
    let url = '/' + bucket.name + '/' + bucket.directory
    let date: string = new Date(+new Date() + bucket.request_expire * 1000).toUTCString()
    let Authorization = await this.authUtil.getHeaderAuth(bucket, 'POST', url, date, null)
    await this.promiseUtil.do((resolve, reject) => {
      request.post({
        url: requestUrl,
        headers: {
          Authorization,
          Date: date,
          folder: true
        }
      },
        (err, res, body) => {
          if (err) {
            reject(new HttpException('目录创建失败，网络错误', 402))
            return
          }
          if (res.statusCode === 200) {
            resolve()
            return
          }
          if (body) {
            try {
              let { msg, code, id } = JSON.parse(body)
              reject(new HttpException(msg, code))
            } catch (err) {
              reject(new HttpException('响应体解析错误', 402))
            }
          } else {
            reject(new HttpException('响应体不存在', 402))
          }
          return
        })
    })
    return
  }

  /* 删除指定空间指定文件
     @Param bucket：文件所属空间
     @Param file：文件对象
   */
  async deleteFile(bucket: Bucket, file: File | Image | Video | Audio | Document): Promise<void> {
    let save_key = '/' + bucket.directory + '/' + file.name + '.' + file.type
    let requestUrl = this.apihost + '/' + bucket.name + save_key
    let url = '/' + bucket.name + save_key
    let date: string = new Date(+new Date() + bucket.request_expire * 1000).toUTCString()
    let Authorization = await this.authUtil.getHeaderAuth(bucket, 'DELETE', url, date, '')
    await this.promiseUtil.do((resolve, reject) => {
      request.delete({
        url: requestUrl,
        headers: {
          Authorization,
          Date: date
        }
      }, (err, res, body) => {
        if (err) {
          reject(new HttpException('删除文件失败', 402))
          return
        }
        if (res.statusCode == 200) {
          resolve()
          return
        }
        if (body) {
          try {
            let { msg, code, id } = JSON.parse(body)
            reject(new HttpException(msg, code))
          } catch (err) {
            reject(new HttpException('响应体解析错误', 402))
          }
        } else {
          reject(new HttpException('响应体不存在', 402))
        }
        return
      });
    })
    return
  }


  /* 获取指定文件的保存信息
   */
  async getFileInfo(bucket: Bucket, file: File | Image | Video | Audio | Document): Promise<{ file_size: number, file_date: any, file_md5: string }> {
    let save_key = '/' + bucket.directory + '/' + file.name + '.' + file.type
    let requestUrl = this.apihost + '/' + bucket.name + save_key
    let url = '/' + bucket.name + save_key
    let date: string = new Date(+new Date() + bucket.request_expire * 1000).toUTCString()
    let Authorization = await this.authUtil.getHeaderAuth(bucket, 'HEAD', url, date, '')
    let file_size, file_date, file_md5
    await this.promiseUtil.do((resolve, reject) => {
      request.head({
        url: requestUrl,
        headers: {
          Authorization,
          Date: date
        }
      }, (err, res, body) => {
        if (err) {
          reject(new HttpException('获取文件信息失败', 402))
          return
        }
        if (res.statusCode == 200) {
          file_size = +res.headers['x-upyun-file-size']
          file_date = +res.headers['x-upyun-file-date']
          file_md5 = res.headers['content-md5']
          resolve()
          return
        }
        if (body) {
          try {
            let { msg, code, id } = JSON.parse(body)
            reject(new HttpException(msg, code))
          } catch (err) {
            reject(new HttpException('响应体解析错误', 402))
          }
        } else {
          reject(new HttpException('响应体不存在', 402))
        }
        return
      });
    })
    return { file_size, file_date, file_md5 }
  }


  /* 获取指定空间下文件\目录列表
     响应头信息中指明了分页位置
     响应体为换行符、空格拼接的字符串，列分别为
     文件名/目录名  类型(N表示文件、F标志目录) 大小 最后修改时间
   */
  async getFileList(bucket: Bucket): Promise<any> {
    let save_key = '/' + bucket.directory
    let requestUrl = this.apihost + '/' + bucket.name + save_key
    let url = '/' + bucket.name + save_key
    let date: string = new Date(+new Date() + bucket.request_expire * 1000).toUTCString()
    let Authorization = await this.authUtil.getHeaderAuth(bucket, 'GET', url, date, '')
    let info
    await this.promiseUtil.do((resolve, reject) => {
      request.get({
        url: requestUrl,
        headers: {
          Authorization,
          Date: date
        }
      }, (err, res, body) => {
        if (err) {
          reject(new HttpException('获取文件信息失败', 402))
          return
        }
        if (res.statusCode == 200) {
          info = body.split('\n').map((value, index, raw) => {
            let temp = value.split('\t')
            return {
              name: temp[0],
              isDirectory: (temp[1] === 'N' ? false : true),
              size: parseInt(temp[2]),
              timestamp: parseInt(temp[3])
            }
          })
          resolve()
          return
        }
        reject(new HttpException('获取文件列表失败', 402))
        return
      });
    })
    return info
  }
}