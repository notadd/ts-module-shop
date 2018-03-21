import { ImageProcessUtil } from '../util/ImageProcessUtil';
import { HeaderParam } from '../interface/file/HeaderParam';
import { QueryParam } from '../interface/file/QueryParam';
import { Repository } from 'typeorm';
import { PathParam } from '../interface/file/PathParam';
import { FileService } from '../service/FileService';
import { CommonData } from '../interface/Common';
import { TokenUtil } from '../util/TokenUtil';
import { FileUtil } from '../util/FileUtil';
import { KindUtil } from '../util/KindUtil';
import { Bucket } from '../model/Bucket';
import { Image } from '../model/Image';
import { File } from '../model/File';
export declare class FileController {
    private readonly fileUtil;
    private readonly kindUtil;
    private readonly tokenUtil;
    private readonly fileService;
    private readonly imageProcessUtil;
    private readonly fileRepository;
    private readonly imageRepository;
    private readonly bucketRepository;
    constructor(fileUtil: FileUtil, kindUtil: KindUtil, tokenUtil: TokenUtil, fileService: FileService, imageProcessUtil: ImageProcessUtil, fileRepository: Repository<File>, imageRepository: Repository<Image>, bucketRepository: Repository<Bucket>);
    download(headers: HeaderParam, res: any): Promise<any>;
    upload(body: any): Promise<CommonData & {
        url: string;
    }>;
    visit(param: PathParam, query: QueryParam, res: any, req: any): Promise<any>;
}
