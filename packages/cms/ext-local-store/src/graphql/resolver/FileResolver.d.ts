/// <reference types="node" />
import { DownloadProcessData } from '../../interface/file/DownloadProcessData';
import { UploadProcessBody } from '../../interface/file/UploadProcessBody';
import { UploadProcessData } from '../../interface/file/UploadProcessData';
import { FileLocationBody } from '../../interface/file/FileLocationBody';
import { ConfigService } from '../../service/ConfigService';
import { Repository } from 'typeorm';
import { FileService } from '../../service/FileService';
import { AllBody } from '../../interface/file/AllBody';
import { AllData } from '../../interface/file/AllData';
import { OneBody } from '../../interface/file/OneBody';
import { OneData } from '../../interface/file/OneData';
import { RestfulUtil } from '../../util/RestfulUtil';
import { Bucket } from '../../model/Bucket.entity';
import { Image } from '../../model/Image.entity';
import { File } from '../../model/File.entity';
import { KindUtil } from '../../util/KindUtil';
import { AuthUtil } from '../../util/AuthUtil';
import { Data } from '../../interface/Data';
import { IncomingMessage } from 'http';
export declare class FileResolver {
    private readonly authUtil;
    private readonly kindUtil;
    private readonly restfulUtil;
    private readonly fileService;
    private readonly configService;
    private readonly fileRepository;
    private readonly imageRepository;
    private readonly bucketRepository;
    constructor(authUtil: AuthUtil, kindUtil: KindUtil, restfulUtil: RestfulUtil, fileService: FileService, configService: ConfigService, fileRepository: Repository<File>, imageRepository: Repository<Image>, bucketRepository: Repository<Bucket>);
    downloadProcess(req: IncomingMessage, body: FileLocationBody): Promise<DownloadProcessData>;
    uploadProcess(req: IncomingMessage, body: UploadProcessBody): Promise<UploadProcessData>;
    getFile(req: IncomingMessage, body: OneBody): Promise<OneData>;
    files(req: IncomingMessage, body: AllBody): Promise<AllData>;
    deleteFile(req: IncomingMessage, body: FileLocationBody): Promise<Data>;
}
