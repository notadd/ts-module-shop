import { SecondClassify } from "../model/second.classify.entity";
import { FirstClassify } from "../model/first.classify.entity";
import { ThirdClassify } from "../model/third.classify.entity";
import { Component, HttpException } from "@nestjs/common";
import { Classify } from "../interface/classify/classify";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


/* 分类的服务组件，一、二、三级分类三个实体被分别操作 */
@Component()
export class ClassifyService {

    constructor(
        @InjectRepository(FirstClassify) private readonly firstClassifyRepository: Repository<FirstClassify>,
        @InjectRepository(SecondClassify) private readonly secondClassifyRepository: Repository<SecondClassify>,
        @InjectRepository(ThirdClassify) private readonly thirdClassifyRepository: Repository<ThirdClassify>
    ) { }

    /* 获取指定级别、指定父分类下的所有分类，级别是要获取分类的级别，如果父分类不存在，则获取这个级别所有分类，一级分类不需要指定父分类 */
    async getClassifes(parentId: number, level: number): Promise<Array<Classify>> {
        if (level === 1) {
            return this.firstClassifyRepository.find();
        } else if (level === 2) {
            let parent: FirstClassify | undefined;
            if (parentId) {
                parent = await this.firstClassifyRepository.findOneById(parentId);
                if (!parent) {
                    throw new HttpException("指定id=" + parentId + "上级分类不存在", 404);
                }
            }
            return this.secondClassifyRepository.find({ parent });
        } else {
            let parent: SecondClassify | undefined;
            if (parentId) {
                parent = await this.secondClassifyRepository.findOneById(parentId);
                if (!parent) {
                    throw new HttpException("指定id=" + parentId + "上级分类不存在", 404);
                }
            }
            return this.thirdClassifyRepository.find({ parent });
        }
    }

    /* 获取指定id、级别分类的具体信息 */
    async getClassify(id: number, level: number): Promise<Classify | undefined> {
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

    /* 创建指定名称、描述、级别、父分类的分类 */
    async createClassify(name: string, description: string, level: number, parentId: number): Promise<void> {
        if (level === 1) {
            const exist: FirstClassify | undefined = await this.firstClassifyRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "一级分类已存在", 404);
            }
            try {
                await this.firstClassifyRepository.save({ name, description });
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        } else if (level === 2) {
            const exist: SecondClassify | undefined = await this.secondClassifyRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "二级分类已存在", 404);
            }
            const parent: FirstClassify | undefined = await this.firstClassifyRepository.findOneById(parentId);
            if (!parent) {
                throw new HttpException("指定id=" + parentId + "上级分类不存在", 404);
            }
            try {
                await this.secondClassifyRepository.save({ name, description, parent });
            } catch (err) {
                throw new HttpException("发生了数据库错误" + err.toString(), 403);
            }
        } else {
            const exist: ThirdClassify | undefined = await this.thirdClassifyRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "三级分类已存在", 404);
            }
            const parent: SecondClassify | undefined = await this.secondClassifyRepository.findOneById(parentId);
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

    /* 更新指定id、级别分类，只能更新名称、描述字段，不能更新父分类等 */
    async updateClassify(id: number, name: string, description: string, level: number): Promise<void> {
        if (level === 1) {
            const classify: FirstClassify | undefined = await this.firstClassifyRepository.findOneById(id);
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
            const classify: SecondClassify | undefined = await this.secondClassifyRepository.findOneById(id);
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
            const classify: ThirdClassify | undefined = await this.thirdClassifyRepository.findOneById(id);
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

    /* 删除指定id、级别分类，根据级别分别操作三个实体 */
    async deleteClassify(id: number, level: number): Promise<void> {
        if (level === 1) {
            const classify: FirstClassify | undefined = await this.firstClassifyRepository.findOneById(id, { relations: ["children"] });
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
            const classify: SecondClassify | undefined = await this.secondClassifyRepository.findOneById(id, { relations: ["children"] });
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
            const classify: ThirdClassify | undefined = await this.thirdClassifyRepository.findOneById(id, { relations: ["goodses"] });
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