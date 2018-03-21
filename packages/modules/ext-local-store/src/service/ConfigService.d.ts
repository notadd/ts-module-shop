import { EnableImageWatermark } from '../interface/config/EnableImageWatermark';
import { BucketConfig } from '../interface/config/BucketConfig';
import { ImageFormat } from '../interface/config/ImageFormat';
import { AudioFormat } from '../interface/config/AudioFormat';
import { VideoFormat } from '../interface/config/VideoFormat';
import { ImageProcessUtil } from '../util/ImageProcessUtil';
import { ImageConfig } from '../model/ImageConfig';
import { AudioConfig } from '../model/AudioConfig';
import { VideoConfig } from '../model/VideoConfig';
import { FileUtil } from '../util/FileUtil';
import { Bucket } from '../model/Bucket';
import { Image } from '../model/Image';
import { Repository } from 'typeorm';
export declare class ConfigService {
    private readonly fileUtil;
    private readonly imageProcessUtil;
    private readonly imageRepository;
    private readonly bucketRepository;
    private readonly imageConfigRepository;
    private readonly audioConfigRepository;
    private readonly videoConfigRepository;
    constructor(fileUtil: FileUtil, imageProcessUtil: ImageProcessUtil, imageRepository: Repository<Image>, bucketRepository: Repository<Bucket>, imageConfigRepository: Repository<ImageConfig>, audioConfigRepository: Repository<AudioConfig>, videoConfigRepository: Repository<VideoConfig>);
    saveBucketConfig(body: BucketConfig): Promise<void>;
    saveImageFormat(body: ImageFormat): Promise<void>;
    saveEnableImageWatermark(body: EnableImageWatermark): Promise<void>;
    saveImageWatermark(file: any, obj: any): Promise<void>;
    saveAudioFormat(body: AudioFormat): Promise<any>;
    saveVideoFormat(body: VideoFormat): Promise<any>;
}
