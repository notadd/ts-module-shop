import { SecondClassify } from '../model/SecondClassify.entity';
import { FirstClassify } from '../model/FirstClassify.entity';
import { ThirdClassify } from '../model/ThirdClassify.entity';
import { Component, HttpException } from '@nestjs/common';
import { Classify } from '../interface/classify/Classify';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventListenerTypes } from 'typeorm/metadata/types/EventListenerTypes';

@Component()
export class ClassifyService {

    constructor(
        @InjectRepository(FirstClassify) private readonly firstClassifyRepository: Repository<FirstClassify>,
        @InjectRepository(SecondClassify) private readonly secondClassifyRepository: Repository<SecondClassify>,
        @InjectRepository(ThirdClassify) private readonly thirdClassifyRepository: Repository<ThirdClassify>
    ) { }

    async getClassifes(parentId: number, level: number): Promise<Classify[]> {
        if (level === 1) {
            return await this.firstClassifyRepository.find()
        } else if (level === 2) {
            let parent: FirstClassify
            if (parentId) {
                parent = await this.firstClassifyRepository.findOneById(parentId)
                if (!parent) {
                    throw new HttpException('指定id=' + parentId + '上级分类不存在', 404)
                }
            }
            return await this.secondClassifyRepository.find({ parent })
        } else {
            let parent: SecondClassify
            if (parentId) {
                parent = await this.secondClassifyRepository.findOneById(parentId)
                if (!parent) {
                    throw new HttpException('指定id=' + parentId + '上级分类不存在', 404)
                }
            }
            return await this.thirdClassifyRepository.find({ parent })
        }
    }

    async getClassify(id: number, level: number): Promise<Classify> {
        if (level === 1) {
            return await this.firstClassifyRepository.findOneById(id)
        } else if (level === 2) {
            return await this.secondClassifyRepository.findOneById(2)
        } else {
            return await this.thirdClassifyRepository.findOneById(id)
        }
    }

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

    async updateClassify(id: number, name: string, description: string, level: number): Promise<void> {
        if (level === 1) {
            let classify: FirstClassify = await this.firstClassifyRepository.findOneById(id)
            if (!classify) {
                throw new HttpException('指定id=' + id + '一级分类不存在', 404)
            }
            classify.name = name
            classify.description = description
            try {
                await this.firstClassifyRepository.save(classify)
            } catch (err) {
                throw new HttpException('发生了数据库错误' + err.toString(), 403)
            }
        } else if (level === 2) {
            let classify: SecondClassify = await this.secondClassifyRepository.findOneById(id)
            if (!classify) {
                throw new HttpException('指定id=' + id + '二级分类不存在', 404)
            }
            classify.name = name
            classify.description = description
            try {
                await this.secondClassifyRepository.save(classify)
            } catch (err) {
                throw new HttpException('发生了数据库错误' + err.toString(), 403)
            }
        } else {
            let classify: ThirdClassify = await this.thirdClassifyRepository.findOneById(id)
            if (!classify) {
                throw new HttpException('指定id=' + id + '三级分类不存在', 404)
            }
            classify.name = name
            classify.description = description
            try {
                await this.thirdClassifyRepository.save(classify)
            } catch (err) {
                throw new HttpException('发生了数据库错误' + err.toString(), 403)
            }
        }
    }

    async deleteClassify(id: number, level: number): Promise<void> {
        if (level === 1) {
            let classify: FirstClassify = await this.firstClassifyRepository.findOneById(id)
            if (!classify) {
                throw new HttpException('指定id=' + id + '一级分类不存在', 404)
            }
            try {
                await this.firstClassifyRepository.remove(classify)
            } catch (err) {
                throw new HttpException('发生了数据库错误' + err.toString(), 403)
            }
        } else if (level === 2) {
            let classify: SecondClassify = await this.secondClassifyRepository.findOneById(id)
            if (!classify) {
                throw new HttpException('指定id=' + id + '二级分类不存在', 404)
            }
            try {
                await this.secondClassifyRepository.remove(classify)
            } catch (err) {
                throw new HttpException('发生了数据库错误' + err.toString(), 403)
            }
        } else {
            let classify: ThirdClassify = await this.thirdClassifyRepository.findOneById(id)
            if (!classify) {
                throw new HttpException('指定id=' + id + '三级分类不存在', 404)
            }
            try {
                await this.thirdClassifyRepository.remove(classify)
            } catch (err) {
                throw new HttpException('发生了数据库错误' + err.toString(), 403)
            }
        }
    }
}