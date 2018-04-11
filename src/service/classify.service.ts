import { SecondClassify } from "../model/second.classify.entity";
import { FirstClassify } from "../model/first.classify.entity";
import { ThirdClassify } from "../model/third.classify.entity";
import { Component, HttpException } from "@nestjs/common";
import { Classify } from "../interface/classify/classify";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Component()
export class ClassifyService {

    constructor(
        @InjectRepository(FirstClassify) private readonly firstClassifyRepository: Repository<FirstClassify>,
        @InjectRepository(SecondClassify) private readonly secondClassifyRepository: Repository<SecondClassify>,
        @InjectRepository(ThirdClassify) private readonly thirdClassifyRepository: Repository<ThirdClassify>
    ) { }

    async getClassifes(parentId: number, level: number): Promise<Array<Classify>> {
        if (level === 1) {
            return this.firstClassifyRepository.find();
        } else if (level === 2) {
            let parent: FirstClassify|undefined;
            if (parentId) {
                parent = await this.firstClassifyRepository.findOneById(parentId);
                if (!parent) {
                    throw new HttpException("指定id=" + parentId + "上级分类不存在", 404);
                }
            }
            return this.secondClassifyRepository.find({ parent });
        } else {
            let parent: SecondClassify|undefined;
            if (parentId) {
                parent = await this.secondClassifyRepository.findOneById(parentId);
                if (!parent) {
                    throw new HttpException("指定id=" + parentId + "上级分类不存在", 404);
                }
            }
            return this.thirdClassifyRepository.find({ parent });
        }
    }

    async getClassify(id: number, level: number): Promise<Classify|undefined> {
        let result: any;
        if (level === 1) {
            result = await this.firstClassifyRepository.findOneById(id);
        } else if (level === 2) {
            result = await this.secondClassifyRepository.findOneById(2);
        } else {
            result = await this.thirdClassifyRepository.findOneById(id);
        }
        return result;
    }

    async createClassify(name: string, description: string, level: number, parentId: number): Promise<void> {
        if (level === 1) {
            const exist: FirstClassify|undefined = await this.firstClassifyRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "一级分类已存在", 404);
            }
            try {
                await this.firstClassifyRepository.save({ name, description });
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        } else if (level === 2) {
            const exist: SecondClassify|undefined = await this.secondClassifyRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "二级分类已存在", 404);
            }
            const parent: FirstClassify|undefined = await this.firstClassifyRepository.findOneById(parentId);
            if (!parent) {
                throw new HttpException("指定id=" + parentId + "上级分类不存在", 404);
            }
            try {
                await this.secondClassifyRepository.save({ name, description, parent });
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        } else {
            const exist: ThirdClassify|undefined = await this.thirdClassifyRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "三级分类已存在", 404);
            }
            const parent: SecondClassify|undefined = await this.secondClassifyRepository.findOneById(parentId);
            if (!parent) {
                throw new HttpException("指定id=" + parentId + "上级分类不存在", 404);
            }
            try {
                await this.thirdClassifyRepository.save({ name, description, parent });
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        }
    }

    async updateClassify(id: number, name: string, description: string, level: number): Promise<void> {
        if (level === 1) {
            const classify: FirstClassify|undefined = await this.firstClassifyRepository.findOneById(id);
            if (!classify) {
                throw new HttpException("指定id=" + id + "一级分类不存在", 404);
            }
            classify.name = name;
            classify.description = description;
            try {
                await this.firstClassifyRepository.save(classify);
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        } else if (level === 2) {
            const classify: SecondClassify|undefined = await this.secondClassifyRepository.findOneById(id);
            if (!classify) {
                throw new HttpException("指定id=" + id + "二级分类不存在", 404);
            }
            classify.name = name;
            classify.description = description;
            try {
                await this.secondClassifyRepository.save(classify);
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        } else {
            const classify: ThirdClassify|undefined = await this.thirdClassifyRepository.findOneById(id);
            if (!classify) {
                throw new HttpException("指定id=" + id + "三级分类不存在", 404);
            }
            classify.name = name;
            classify.description = description;
            try {
                await this.thirdClassifyRepository.save(classify);
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        }
    }

    async deleteClassify(id: number, level: number): Promise<void> {
        if (level === 1) {
            const classify: FirstClassify|undefined = await this.firstClassifyRepository.findOneById(id, {relations: ["children"]});
            if (!classify) {
                throw new HttpException("指定id=" + id + "一级分类不存在", 404);
            }
            if (classify.children && classify.children.length > 0) {
                throw new HttpException("指定id=" + id + "一级分类下存在二级分类，不能删除", 404);
            }
            try {
                await this.firstClassifyRepository.remove(classify);
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        } else if (level === 2) {
            const classify: SecondClassify|undefined = await this.secondClassifyRepository.findOneById(id, {relations: ["children"]});
            if (!classify) {
                throw new HttpException("指定id=" + id + "二级分类不存在", 404);
            }
            if (classify.children && classify.children.length > 0) {
                throw new HttpException("指定id=" + id + "二级分类下存在三级分类，不能删除", 404);
            }
            try {
                await this.secondClassifyRepository.remove(classify);
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        } else {
            const classify: ThirdClassify|undefined = await this.thirdClassifyRepository.findOneById(id, {relations: ["goodses"]});
            if (!classify) {
                throw new HttpException("指定id=" + id + "三级分类不存在", 404);
            }
            if (classify.goodses && classify.goodses.length > 0) {
                throw new HttpException("指定id=" + id + "三级分类下存在商品，不能删除", 404);
            }
            try {
                await this.thirdClassifyRepository.remove(classify);
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        }
    }
}