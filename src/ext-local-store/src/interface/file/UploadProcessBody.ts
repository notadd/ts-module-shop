import { ImagePreProcessInfo } from './ImageProcessInfo'


export interface UploadProcessBody {
    bucketName: string
    md5: string
    contentName: string
    contentSecret?: string
    tags?: string[]
    imagePreProcessInfo?: ImagePreProcessInfo
}