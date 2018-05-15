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
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const member_entity_1 = require("../model/member.entity");
let MemberService = class MemberService {
    constructor(memberRepository) {
        this.memberRepository = memberRepository;
    }
    getMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield this.memberRepository.find();
            return members;
        });
    }
    getMember(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.memberRepository.findOne(id);
            if (!member) {
                throw new common_1.HttpException("指定id=" + id + "会员不存在", 404);
            }
            return member;
        });
    }
    createMember(name, realName, email, sex, idNumber, birthday, password, mobilePhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.memberRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException("指定name=" + name + "会员已存在", 404);
            }
            try {
                yield this.memberRepository.save({ name, realName, email, sex, idNumber, birthday, password, mobilePhone });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateMember(id, email, sex, birthday, password, mobilePhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.memberRepository.findOne(id);
            if (!member) {
                throw new common_1.HttpException("指定id=" + id + "会员不存在", 404);
            }
            member.email = email;
            member.sex = sex;
            member.birthday = new Date(birthday);
            member.password = password;
            member.mobilePhone = mobilePhone;
            try {
                yield this.memberRepository.save(member);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteMember(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.memberRepository.findOne(id);
            if (!member) {
                throw new common_1.HttpException("指定id=" + id + "会员不存在", 404);
            }
            try {
                yield this.memberRepository.remove(member);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
MemberService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(member_entity_1.Member)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], MemberService);
exports.MemberService = MemberService;

//# sourceMappingURL=member.service.js.map
