import { ImageConfig } from '../model/ImageConfig';
import { AudioConfig } from '../model/AudioConfig';
import { VideoConfig } from '../model/VideoConfig';
import { Document } from '../model/Document';
import { createConnection,Connection } from 'typeorm';
import { Bucket } from '../model/Bucket';
import { Audio } from '../model/Audio';
import { Video } from '../model/Video';
import { Image } from '../model/Image';
import { File } from '../model/File';
export const ConnectionProvider = {
    provide:'LocalModule.Connection',
    useFactory:async ()=>{
        return await createConnection({
            name:'local',
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '123456',
            database: "local",
            synchronize:true,
            dropSchema:true,
            logger:'simple-console',
            logging:false,
            entities: [
                ImageConfig,
                AudioConfig,
                VideoConfig,
                Bucket,
                Document,
                Audio,
                Video,
                File,
                Image
            ]


        })
    }
}