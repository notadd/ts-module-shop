"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const StoreComponentProvider_1 = require("./export/StoreComponentProvider");
const RepositorysProvider_1 = require("./database/RepositorysProvider");
const ConfigResolver_1 = require("./graphql/resolver/ConfigResolver");
const ConnectionProvider_1 = require("./database/ConnectionProvider");
const FileResolver_1 = require("./graphql/resolver/FileResolver");
const FileController_1 = require("./controller/FileController");
const ImageProcessUtil_1 = require("./util/ImageProcessUtil");
const ConfigService_1 = require("./service/ConfigService");
const FileService_1 = require("./service/FileService");
const common_1 = require("@nestjs/common");
const TokenUtil_1 = require("./util/TokenUtil");
const FileUtil_1 = require("./util/FileUtil");
const KindUtil_1 = require("./util/KindUtil");
let LocalModule = class LocalModule {
};
LocalModule = __decorate([
    common_1.Global(),
    common_1.Module({
        modules: [],
        controllers: [FileController_1.FileController],
        components: [ConnectionProvider_1.ConnectionProvider, ...RepositorysProvider_1.RepositorysProvider, ConfigResolver_1.ConfigResolver, ConfigService_1.ConfigService, FileResolver_1.FileResolver, FileService_1.FileService, KindUtil_1.KindUtil, FileUtil_1.FileUtil, TokenUtil_1.TokenUtil, ImageProcessUtil_1.ImageProcessUtil, StoreComponentProvider_1.StoreComponentProvider],
        exports: [StoreComponentProvider_1.StoreComponentProvider]
    })
], LocalModule);
exports.LocalModule = LocalModule;
