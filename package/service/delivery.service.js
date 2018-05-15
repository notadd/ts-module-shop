"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const delivery_entity_1 = require("../model/delivery.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DeliveryService = class DeliveryService {
    constructor(deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }
    getDeliveries() {
        return __awaiter(this, void 0, void 0, function* () {
            const deliveries = yield this.deliveryRepository.find();
            return deliveries;
        });
    }
    createDelivery(name, description, cost, freeLimit, valuationFee) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.deliveryRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException("指定name=" + name + "配送信息已存在", 404);
            }
            try {
                yield this.deliveryRepository.save({ name, description, cost, freeLimit, valuationFee });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateDelivery(id, name, description, cost, freeLimit, valuationFee) {
        return __awaiter(this, void 0, void 0, function* () {
            const delivery = yield this.deliveryRepository.findOne(id);
            if (!delivery) {
                throw new common_1.HttpException("指定id=" + id + "配送信息不存在", 404);
            }
            if (name && name !== delivery.name) {
                const exist = yield this.deliveryRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "配送信息已存在", 404);
                }
                delivery.name = name;
            }
            if (description) {
                delivery.description = description;
            }
            if (cost !== undefined && cost !== null) {
                delivery.cost = cost;
            }
            if (freeLimit !== undefined && freeLimit !== null) {
                delivery.freeLimit = freeLimit;
            }
            if (valuationFee !== undefined && valuationFee !== null) {
                delivery.valuationFee = valuationFee;
            }
            try {
                yield this.deliveryRepository.save(delivery);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteDelivery(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const delivery = yield this.deliveryRepository.findOne(id);
            if (!delivery) {
                throw new common_1.HttpException("指定id=" + id + "配送信息不存在", 404);
            }
            try {
                yield this.deliveryRepository.remove(delivery);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
DeliveryService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(delivery_entity_1.Delivery)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeliveryService);
exports.DeliveryService = DeliveryService;

//# sourceMappingURL=delivery.service.js.map
