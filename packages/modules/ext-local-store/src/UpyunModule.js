"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const StoreComponentProvider_1 = require("./export/StoreComponentProvider");
const ConfigResolver_1 = require("./graphql/resolver/ConfigResolver");
const FileResolver_1 = require("./graphql/resolver/FileResolver");
const FileController_1 = require("./controller/FileController");
const ProcessStringUtil_1 = require("./util/ProcessStringUtil");
const ImageConfig_entity_1 = require("./model/ImageConfig.entity");
const AudioConfig_entity_1 = require("./model/AudioConfig.entity");
const VideoConfig_entity_1 = require("./model/VideoConfig.entity");
const ConfigService_1 = require("./service/ConfigService");
const FileService_1 = require("./service/FileService");
const Document_entity_1 = require("./model/Document.entity");
const RestfulUtil_1 = require("./util/RestfulUtil");
const PromiseUtil_1 = require("./util/PromiseUtil");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Bucket_entity_1 = require("./model/Bucket.entity");
const Image_entity_1 = require("./model/Image.entity");
const Audio_entity_1 = require("./model/Audio.entity");
const Video_entity_1 = require("./model/Video.entity");
const File_entity_1 = require("./model/File.entity");
const KindUtil_1 = require("./util/KindUtil");
const FileUtil_1 = require("./util/FileUtil");
const AuthUtil_1 = require("./util/AuthUtil");
let UpyunModule = class UpyunModule {
};
UpyunModule = __decorate([
    common_1.Global(),
    common_1.Module({
        modules: [typeorm_1.TypeOrmModule.forFeature([Bucket_entity_1.Bucket, AudioConfig_entity_1.AudioConfig, VideoConfig_entity_1.VideoConfig, ImageConfig_entity_1.ImageConfig, Document_entity_1.Document, Audio_entity_1.Audio, Video_entity_1.Video, File_entity_1.File, Image_entity_1.Image])],
        controllers: [FileController_1.FileController],
        components: [
            PromiseUtil_1.PromiseUtil, FileUtil_1.FileUtil, AuthUtil_1.AuthUtil, KindUtil_1.KindUtil, RestfulUtil_1.RestfulUtil, ProcessStringUtil_1.ProcessStringUtil,
            ConfigService_1.ConfigService, FileService_1.FileService,
            ConfigResolver_1.ConfigResolver, FileResolver_1.FileResolver,
            StoreComponentProvider_1.StoreComponentProvider
        ],
        exports: [StoreComponentProvider_1.StoreComponentProvider]
    })
], UpyunModule);
exports.UpyunModule = UpyunModule;
