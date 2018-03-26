import { EnableImageWatermarkConfig } from '../interface/config/EnableImageWatermarkConfig';
import { Repository } from 'typeorm';
import { VideoFormatConfig } from '../interface/config/VideoFormatConfig';
import { AudioFormatConfig } from '../interface/config/AudioFormatConfig';
import { ImageFormatConfig } from '../interface/config/ImageFormatConfig';
import { BucketConfig } from '../interface/config/BucketConfig';
import { ImageConfig } from '../model/ImageConfig.entity';
import { AudioConfig } from '../model/AudioConfig.entity';
import { VideoConfig } from '../model/VideoConfig.entity';
import { RestfulUtil } from "../util/RestfulUtil";
import { Bucket } from '../model/Bucket.entity';
import { Image } from '../model/Image.entity';
import { FileUtil } from '../util/FileUtil';
export declare class ConfigService {
    private readonly fileUtil;
    private readonly restfulUtil;
    private readonly imageRepository;
    private readonly bucketRepository;
    private readonly imageConfigRepository;
    private readonly audioConfigRepository;
    private readonly videoConfigRepository;
    constructor(fileUtil: FileUtil, restfulUtil: RestfulUtil, imageRepository: Repository<Image>, bucketRepository: Repository<Bucket>, imageConfigRepository: Repository<ImageConfig>, audioConfigRepository: Repository<AudioConfig>, videoConfigRepository: Repository<VideoConfig>);
    saveBucketConfig(body: BucketConfig): Promise<Bucket>;
    saveImageFormatConfig(body: ImageFormatConfig): Promise<any>;
    saveEnableImageWatermarkConfig(body: EnableImageWatermarkConfig): Promise<void>;
    saveImageWatermarkConfig(file: any, obj: any): Promise<void>;
    saveAudioFormatConfig(body: AudioFormatConfig): Promise<void>;
    saveVideoFormatConfig(body: VideoFormatConfig): Promise<void>;
}
