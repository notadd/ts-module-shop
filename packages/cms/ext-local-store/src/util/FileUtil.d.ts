/// <reference types="node" />
import { PromiseUtil } from './PromiseUtil';
export declare class FileUtil {
    private readonly promiseUtil;
    constructor(promiseUtil: PromiseUtil);
    write(path: string, buffer: Buffer): Promise<void>;
    read(path: string): Promise<Buffer>;
    delete(path: string): Promise<void>;
    deleteIfExist(path: string): Promise<void>;
    size(path: string): Promise<number>;
    exist(path: string): boolean;
    mkdir(path: string): Promise<void>;
}
