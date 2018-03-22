import { ImageConfig } from './ImageConfig.entity';
import { AudioConfig } from './AudioConfig.entity';
import { VideoConfig } from './VideoConfig.entity';
import { Document } from './Document.entity';
import { Image } from './Image.entity';
import { Video } from './Video.entity';
import { Audio } from './Audio.entity';
import { File } from './File.entity';
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
