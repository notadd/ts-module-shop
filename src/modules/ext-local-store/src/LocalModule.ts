import { StoreComponentProvider } from './export/StoreComponentProvider';
import { ConfigResolver } from './graphql/resolver/ConfigResolver';
import { FileResolver } from './graphql/resolver/FileResolver';
import { FileController } from './controller/FileController';
import { ImageProcessUtil } from './util/ImageProcessUtil';
import { ConfigService } from './service/ConfigService';
import { FileService } from './service/FileService';
import { ImageConfig } from './model/ImageConfig.entity';
import { AudioConfig } from './model/AudioConfig.entity';
import { VideoConfig } from './model/VideoConfig.entity';
import { Document } from './model/Document.entity';
import { TypeOrmModule } from  '@nestjs/typeorm';
import { Bucket } from './model/Bucket.entity';
import { Module ,Global} from '@nestjs/common';
import { TokenUtil } from './util/TokenUtil';
import { Audio } from './model/Audio.entity';
import { Video } from './model/Video.entity';
import { Image } from './model/Image.entity';
import { File } from './model/File.entity';
import { FileUtil } from './util/FileUtil';
import { KindUtil } from './util/KindUtil';


@Global()
@Module({
  modules: [TypeOrmModule.forFeature([Bucket,ImageConfig,AudioConfig,VideoConfig,File,Document,Audio,Video,Image])],
  controllers: [FileController],
  components: [ConfigResolver, ConfigService, FileResolver, FileService, KindUtil, FileUtil, TokenUtil, ImageProcessUtil,StoreComponentProvider],
  exports: [StoreComponentProvider]
})

export class LocalModule { }
