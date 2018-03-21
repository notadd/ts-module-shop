/// <reference types="node" />
export declare class FileUtil {
    constructor();
    write(path: string, buffer: Buffer): Promise<void>;
    read(path: string): Promise<Buffer>;
    delete(path: string): Promise<void>;
    deleteIfExist(path: string): Promise<void>;
    size(path: string): Promise<number>;
    exist(path: string): boolean;
    mkdir(path: string): Promise<void>;
}
