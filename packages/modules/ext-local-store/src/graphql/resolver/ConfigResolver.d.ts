/// <reference types="node" />
import { EnableImageWatermark } from '../../interface/config/EnableImageWatermark';
import { ImageWatermark } from '../../interface/config/ImageWatermark';
import { BucketConfig } from '../../interface/config/BucketConfig';
import { BucketsData } from '../../interface/config/BucketsData';
import { ImageFormat } from '../../interface/config/ImageFormat';
import { AudioFormat } from '../../interface/config/AudioFormat';
import { VideoFormat } from '../../interface/config/VideoFormat';
import { ConfigService } from '../../service/ConfigService';
import { IncomingMessage } from 'http';
import { CommonData } from '../../interface/Common';
import { Bucket } from '../../model/Bucket.entity';
import { KindUtil } from '../../util/KindUtil';
import { FileUtil } from '../../util/FileUtil';
import { Repository } from 'typeorm';
export declare class ConfigResolver {
    private readonly fileUtil;
    private readonly kindUtil;
    private readonly configService;
    private readonly bucketRepository;
    private readonly gravity;
    private readonly image_format;
    private readonly audio_format;
    private readonly video_format;
    private readonly video_resolution;
    constructor(fileUtil: FileUtil, kindUtil: KindUtil, configService: ConfigService, bucketRepository: Repository<Bucket>);
    bucket(req: IncomingMessage, body: BucketConfig): Promise<CommonData>;
    imageFormat(req: IncomingMessage, body: ImageFormat): Promise<CommonData>;
    enableImageWatermark(req: IncomingMessage, body: EnableImageWatermark): Promise<CommonData>;
    imageWatermark(req: IncomingMessage, body: ImageWatermark): Promise<CommonData>;
    audioFormat(req: IncomingMessage, body: AudioFormat): Promise<CommonData>;
    videoFormat(req: IncomingMessage, body: VideoFormat): Promise<CommonData>;
    buckets(req: IncomingMessage): Promise<BucketsData>;
}
