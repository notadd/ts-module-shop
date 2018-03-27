import { ImagePostProcessInfo } from './ImageProcessInfo'

export interface OneBody {
    bucketName: string
    name: string
    type: string
    imagePostProcessInfo?: ImagePostProcessInfo
}