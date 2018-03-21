import { ImagePostProcessInfo, ImagePreProcessInfo } from '../interface/file/ImageProcessInfo';
import { ImageProcessUtil } from '../util/ImageProcessUtil';
import { Repository } from 'typeorm';
import { TokenUtil } from '../util/TokenUtil';
import { FileUtil } from '../util/FileUtil';
import { KindUtil } from '../util/KindUtil';
import { Bucket } from '../model/Bucket';
import { Image } from '../model/Image';
export declare class StoreComponent {
    private readonly kindUtil;
    private readonly fileUtil;
    private readonly tokenUtil;
    private readonly imageProcessUtil;
    private readonly imageRepository;
    private readonly bucketRepository;
    constructor(kindUtil: KindUtil, fileUtil: FileUtil, tokenUtil: TokenUtil, imageProcessUtil: ImageProcessUtil, imageRepository: Repository<Image>, bucketRepository: Repository<Bucket>);
    delete(bucketName: string, name: string, type: string): Promise<void>;
    upload(bucketName: string, rawName: string, base64: string, imagePreProcessInfo: ImagePreProcessInfo): Promise<{
        bucketName: string;
        name: string;
        type: string;
    }>;
    getUrl(req: any, bucketName: string, name: string, type: string, imagePostProcessInfo: ImagePostProcessInfo): Promise<string>;
}
export declare const StoreComponentProvider: {
    provide: string;
    useFactory: (kindUtil: KindUtil, fileUtil: FileUtil, tokenUtil: TokenUtil, imageProcessUtil: ImageProcessUtil, imageRepository: Repository<Image>, bucketRepository: Repository<Bucket>) => StoreComponent;
    inject: (string | typeof KindUtil | typeof FileUtil | typeof ImageProcessUtil | typeof TokenUtil)[];
};
