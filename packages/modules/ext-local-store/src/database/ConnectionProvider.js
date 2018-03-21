"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ImageConfig_1 = require("../model/ImageConfig");
const AudioConfig_1 = require("../model/AudioConfig");
const VideoConfig_1 = require("../model/VideoConfig");
const Document_1 = require("../model/Document");
const typeorm_1 = require("typeorm");
const Bucket_1 = require("../model/Bucket");
const Audio_1 = require("../model/Audio");
const Video_1 = require("../model/Video");
const Image_1 = require("../model/Image");
const File_1 = require("../model/File");
exports.ConnectionProvider = {
    provide: 'LocalModule.Connection',
    useFactory: () => __awaiter(this, void 0, void 0, function* () {
        return yield typeorm_1.createConnection({
            name: 'local',
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '123456',
            database: "local",
            synchronize: true,
            dropSchema: true,
            logger: 'simple-console',
            logging: false,
            entities: [
                ImageConfig_1.ImageConfig,
                AudioConfig_1.AudioConfig,
                VideoConfig_1.VideoConfig,
                Bucket_1.Bucket,
                Document_1.Document,
                Audio_1.Audio,
                Video_1.Video,
                File_1.File,
                Image_1.Image
            ]
        });
    })
};
