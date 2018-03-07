import { StoreComponentProvider} from './export/StoreComponentProvider';

import { RepositorysProvider } from './database/RepositorysProvider';
import { ConfigResolver } from './graphql/resolver/ConfigResolver';
import { ConnectionProvider } from './database/ConnectionProvider';
import { FileResolver } from './graphql/resolver/FileResolver';
import { FileController } from './controller/FileController';
import { ImageProcessUtil } from './util/ImageProcessUtil';
import { ConfigService } from './service/ConfigService';
import { FileService } from './service/FileService';
import { ImageConfig } from './model/ImageConfig';
import { AudioConfig } from './model/AudioConfig';
import { VideoConfig } from './model/VideoConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module ,Global} from '@nestjs/common';
import { TokenUtil } from './util/TokenUtil';
import { Document } from './model/Document';
import { FileUtil } from './util/FileUtil';
import { KindUtil } from './util/KindUtil';
import { Bucket } from './model/Bucket';
import { Audio } from './model/Audio';
import { Video } from './model/Video';
import { Image } from './model/Image';
import { File } from './model/File';

@Global()
@Module({
  modules: [],
  controllers: [FileController],
  components: [ConnectionProvider,...RepositorysProvider,ConfigResolver, ConfigService, FileResolver, FileService, KindUtil, FileUtil, TokenUtil, ImageProcessUtil,StoreComponentProvider],
  exports: [StoreComponentProvider]
})

export class LocalModule { }
