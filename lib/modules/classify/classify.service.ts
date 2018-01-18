import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {ClassifyEntity} from "../entity/classify.entity";
import {MessageCodeError} from "../errorMessage/error.interface";

@Component()
export class ClassifyService{
    constructor(@Inject('ClassifyRepositoryToken') private readonly repository:Repository<ClassifyEntity>){}

    /**
     * 新增分类
     * @param {ClassifyEntity} entity
     * @param {string} parent
     * @returns {Promise<ClassifyEntity[]>}
     */
    async createClassify(entity:ClassifyEntity,parent:string):Promise<ClassifyEntity[]>{
        let newClassify:ClassifyEntity[] = await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:entity.classifyAlias}).getMany();
        //别名不能重复
        if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
        let parentClassify:ClassifyEntity = await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:parent}).getOne();
        //通过父级别名确定父级是否存在
        if(parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
        entity.parentId = parentClassify.id;
        this.repository.insert(entity);
       return this.findAllClassify(1);
    }

    /**
     * 查找所有分类
     * @param {number} id
     * @returns {Promise<ClassifyEntity[]>}
     */
    async findAllClassify(id:number):Promise<ClassifyEntity[]>{
        const classify=await this.repository.createQueryBuilder('classify').innerJoinAndSelect('classify.childrens','childrens').orderBy('classify.id').getMany();
        console.log('classify='+JSON.stringify(classify));
        return;
    }
}