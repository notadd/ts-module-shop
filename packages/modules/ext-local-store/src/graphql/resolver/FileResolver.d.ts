/// <reference types="node" />
import { DownloadProcessData } from '../../interface/file/DownloadProcessData';
import { UploadProcessBody } from '../../interface/file/UploadProcessBody';
import { UploadProcessData } from '../../interface/file/UploadProcessData';
import { FileLocationBody } from '../../interface/file/FileLocationBody';
import { Repository } from 'typeorm';
import { FileService } from '../../service/FileService';
import { AllBody } from '../../interface/file/AllBody';
import { AllData } from '../../interface/file/AllData';
import { OneBody } from '../../interface/file/OneBody';
import { OneData } from '../../interface/file/OneData';
import { CommonData } from '../../interface/Common';
import { TokenUtil } from '../../util/TokenUtil';
import { KindUtil } from '../../util/KindUtil';
import { FileUtil } from '../../util/FileUtil';
import { Bucket } from '../../model/Bucket';
import { Image } from '../../model/Image';
import { File } from '../../model/File';
import { IncomingMessage } from 'http';
export declare class FileResolver {
    private readonly fileUtil;
    private readonly kindUtil;
    private readonly tokenUtil;
    private readonly fileService;
    private readonly fileRepository;
    private readonly imageRepository;
    private readonly bucketRepository;
    constructor(fileUtil: FileUtil, kindUtil: KindUtil, tokenUtil: TokenUtil, fileService: FileService, fileRepository: Repository<File>, imageRepository: Repository<Image>, bucketRepository: Repository<Bucket>);
    downloadProcess(req: any, body: FileLocationBody): Promise<DownloadProcessData>;
    uploadProcess(req: any, body: UploadProcessBody): Promise<UploadProcessData>;
    getOne(req: any, body: OneBody): Promise<OneData>;
    files(req: any, body: AllBody): Promise<AllData>;
    deleteFile(req: IncomingMessage, body: FileLocationBody): Promise<CommonData>;
}
