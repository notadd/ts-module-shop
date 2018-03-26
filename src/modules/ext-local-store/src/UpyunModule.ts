import { StoreComponentProvider } from './export/StoreComponentProvider';
import { ConfigResolver } from './graphql/resolver/ConfigResolver';
import { FileResolver } from './graphql/resolver/FileResolver';
import { FileController } from './controller/FileController';
import { ProcessStringUtil } from './util/ProcessStringUtil';
import { ImageConfig } from './model/ImageConfig.entity';
import { AudioConfig } from './model/AudioConfig.entity';
import { VideoConfig } from './model/VideoConfig.entity';
import { ConfigService } from './service/ConfigService';
import { FileService } from './service/FileService';
import { Document } from './model/Document.entity';
import { RestfulUtil } from './util/RestfulUtil';
import { PromiseUtil } from './util/PromiseUtil';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket } from './model/Bucket.entity';
import { Image } from './model/Image.entity';
import { Audio } from './model/Audio.entity';
import { Video } from './model/Video.entity';
import { File } from './model/File.entity';
import { KindUtil } from './util/KindUtil';
import { FileUtil } from './util/FileUtil';
import { AuthUtil } from './util/AuthUtil';


@Global()
@Module({
  modules: [TypeOrmModule.forFeature([Bucket,AudioConfig,VideoConfig,ImageConfig,Document,Audio,Video,File,Image])],
  controllers: [FileController],
  components: [
    PromiseUtil, FileUtil, AuthUtil, KindUtil, RestfulUtil, ProcessStringUtil,
    ConfigService, FileService,
    ConfigResolver, FileResolver,
    StoreComponentProvider
  ],
  exports: [StoreComponentProvider]
})

export class UpyunModule { }
