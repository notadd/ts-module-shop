"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ImageConfig_1 = require("../model/ImageConfig");
const AudioConfig_1 = require("../model/AudioConfig");
const VideoConfig_1 = require("../model/VideoConfig");
const Document_1 = require("../model/Document");
const Bucket_1 = require("../model/Bucket");
const Audio_1 = require("../model/Audio");
const Video_1 = require("../model/Video");
const Image_1 = require("../model/Image");
const File_1 = require("../model/File");
const entityMap = new Map();
entityMap.set('LocalModule.BucketRepository', Bucket_1.Bucket);
entityMap.set('LocalModule.ImageConfigRepository', ImageConfig_1.ImageConfig);
entityMap.set('LocalModule.AudioConfigRepository', AudioConfig_1.AudioConfig);
entityMap.set('LocalModule.VideoConfigRepository', VideoConfig_1.VideoConfig);
entityMap.set('LocalModule.DocumentRepository', Document_1.Document);
entityMap.set('LocalModule.AudioRepository', Audio_1.Audio);
entityMap.set('LocalModule.VideoRepository', Video_1.Video);
entityMap.set('LocalModule.ImageRepository', Image_1.Image);
entityMap.set('LocalModule.FileRepository', File_1.File);
class RepositoryProvider {
}
exports.RepositoryProvider = RepositoryProvider;
exports.RepositorysProvider = [];
entityMap.forEach((entity, token, map) => {
    exports.RepositorysProvider.push({
        provide: token,
        useFactory: (connection) => {
            return connection.getRepository(entity);
        },
        inject: ['LocalModule.Connection']
    });
});
