/// <reference types="node" />
import { EnableImageWatermarkConfig } from '../../interface/config/EnableImageWatermarkConfig';
import { ImageWatermarkConfig } from '../../interface/config/ImageWatermarkConfig';
import { AudioFormatConfig } from '../../interface/config/AudioFormatConfig';
import { VideoFormatConfig } from '../../interface/config/VideoFormatConfig';
import { ImageFormatConfig } from '../../interface/config/ImageFormatConfig';
import { BucketConfig } from '../../interface/config/BucketConfig';
import { ConfigService } from '../../service/ConfigService';
import { RestfulUtil } from '../../util/RestfulUtil';
import { Bucket } from '../../model/Bucket.entity';
import { FileUtil } from '../../util/FileUtil';
import { KindUtil } from '../../util/KindUtil';
import { Data } from '../../interface/Data';
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
export declare class ConfigResolver {
    private readonly fileUtil;
    private readonly kindUtil;
    private readonly restfulUtil;
    private readonly configService;
    private readonly bucketRepository;
    private readonly gravity;
    constructor(fileUtil: FileUtil, kindUtil: KindUtil, restfulUtil: RestfulUtil, configService: ConfigService, bucketRepository: Repository<Bucket>);
    bucket(req: IncomingMessage, body: BucketConfig): Promise<Data>;
    imageFormat(req: IncomingMessage, body: ImageFormatConfig): Promise<Data>;
    enableImageWatermark(req: IncomingMessage, body: EnableImageWatermarkConfig): Promise<Data>;
    imageWatermarkConfig(req: IncomingMessage, body: ImageWatermarkConfig): Promise<Data>;
    audioFormat(req: IncomingMessage, body: AudioFormatConfig): Promise<Data>;
    videoFormat(req: IncomingMessage, body: VideoFormatConfig): Promise<Data>;
    buckets(): Promise<Data & {
        buckets: Bucket[];
    }>;
}
