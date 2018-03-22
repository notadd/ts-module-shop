import { ImageProcessUtil } from '../util/ImageProcessUtil';
import { UploadFile } from '../interface/file/UploadFile';
import { UploadForm } from '../interface/file/UploadForm';
import { Bucket } from '../model/Bucket.entity';
import { TokenUtil } from '../util/TokenUtil';
import { Audio } from '../model/Audio.entity';
import { Video } from '../model/Video.entity';
import { Image } from '../model/Image.entity';
import { KindUtil } from '../util/KindUtil';
import { File } from '../model/File.entity';
import { Repository } from 'typeorm';
export declare class FileService {
    private readonly kindUtil;
    private readonly tokenUtil;
    private readonly imageProcessUtil;
    private readonly fileRepository;
    private readonly imageRepository;
    private readonly audioRepository;
    private readonly videoRepository;
    private readonly bucketRepository;
    constructor(kindUtil: KindUtil, tokenUtil: TokenUtil, imageProcessUtil: ImageProcessUtil, fileRepository: Repository<File>, imageRepository: Repository<Image>, audioRepository: Repository<Audio>, videoRepository: Repository<Video>, bucketRepository: Repository<Bucket>);
    saveUploadFile(bucket: Bucket, file: UploadFile, obj: UploadForm): Promise<string>;
    getAll(data: any, bucket: Bucket): Promise<void>;
}
