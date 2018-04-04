import { SecondClassify } from '../model/SecondClassify.entity';
import { FirstClassify } from '../model/FirstClassify.entity';
import { ThirdClassify } from '../model/ThirdClassify.entity';
import { Component, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Component()
export class ClassifyService {

    constructor(
        @InjectRepository(FirstClassify) private readonly firstClassifyRepository: Repository<FirstClassify>,
        @InjectRepository(SecondClassify) private readonly secondClassifyRepository: Repository<SecondClassify>,
        @InjectRepository(ThirdClassify) private readonly thirdClassifyRepository: Repository<ThirdClassify>
    ) { }

    async createClassify(name: string, description: string, level: number, parentId: number): Promise<void> {
        if (level === 1) {
            let exist: FirstClassify = await this.firstClassifyRepository.findOne({ name })
            if (exist) {
                throw new HttpException('指定name=' + name + '一级分类已存在', 404)
            }
            try {
                await this.firstClassifyRepository.save({ name, description })
            } catch (err) {
                throw new HttpException('发生了数据库错误' + err.toString(), 403)
            }
        } else if (level === 2) {
            let exist: SecondClassify = await this.secondClassifyRepository.findOne({ name })
            if (exist) {
                throw new HttpException('指定name=' + name + '二级分类已存在', 404)
            }
            let parent: FirstClassify = await this.firstClassifyRepository.findOneById(parentId)
            if (!parent) {
                throw new HttpException('指定id=' + parentId + '上级分类不存在', 404)
            }
            try {
                await this.secondClassifyRepository.save({ name, description, parent })
            } catch (err) {
                throw new HttpException('发生了数据库错误' + err.toString(), 403)
            }
        } else {
            let exist: ThirdClassify = await this.thirdClassifyRepository.findOne({ name })
            if (exist) {
                throw new HttpException('指定name=' + name + '三级分类已存在', 404)
            }
            let parent: SecondClassify = await this.secondClassifyRepository.findOneById(parentId)
            if (!parent) {
                throw new HttpException('指定id=' + parentId + '上级分类不存在', 404)
            }
            try {
                await this.thirdClassifyRepository.save({ name, description, parent })
            } catch (err) {
                throw new HttpException('发生了数据库错误' + err.toString(), 403)
            }
        }
    }
}