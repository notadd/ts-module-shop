import { ImageConfig } from './ImageConfig';
import { AudioConfig } from './AudioConfig';
import { VideoConfig } from './VideoConfig';
import { Document } from './Document';
import { Image } from './Image';
import { Video } from './Video';
import { Audio } from './Audio';
import { File } from './File';
export declare class Bucket {
    id: number;
    public_or_private: string;
    name: string;
    token_secret_key: string;
    token_expire: number;
    image_config: ImageConfig;
    audio_config: AudioConfig;
    video_config: VideoConfig;
    files?: Promise<File[]>;
    images?: Promise<Image[]>;
    audios?: Promise<Audio[]>;
    videos?: Promise<Video[]>;
    documents?: Promise<Document[]>;
}
