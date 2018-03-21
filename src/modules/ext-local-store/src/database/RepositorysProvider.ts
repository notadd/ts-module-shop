import { ImageConfig } from '../model/ImageConfig';
import { AudioConfig } from '../model/AudioConfig';
import { VideoConfig } from '../model/VideoConfig';
import { Connection, Repository } from 'typeorm';
import { Document } from '../model/Document';
import { Bucket } from '../model/Bucket';
import { Audio } from '../model/Audio';
import { Video } from '../model/Video';
import { Image } from '../model/Image';
import { File } from '../model/File';

const entityMap: Map<string, Function> = new Map()
entityMap.set('LocalModule.BucketRepository', Bucket)
entityMap.set('LocalModule.ImageConfigRepository', ImageConfig)
entityMap.set('LocalModule.AudioConfigRepository', AudioConfig)
entityMap.set('LocalModule.VideoConfigRepository', VideoConfig)
entityMap.set('LocalModule.DocumentRepository', Document)
entityMap.set('LocalModule.AudioRepository', Audio)
entityMap.set('LocalModule.VideoRepository', Video)
entityMap.set('LocalModule.ImageRepository', Image)
entityMap.set('LocalModule.FileRepository', File)

export class RepositoryProvider {

    provide: string
    useFactory: (connection: Connection) => Repository<any>
    inject: string[]

}

export let RepositorysProvider: Array<RepositoryProvider> = []

entityMap.forEach((entity, token, map) => {
    RepositorysProvider.push({
        provide: token,
        useFactory: (connection: Connection) => {
            return connection.getRepository(entity)
        },
        inject: ['LocalModule.Connection']
    })
})


