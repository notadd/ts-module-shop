import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {ClassifyEntity} from "../entity/classify.entity";
import {MessageCodeError} from "../errorMessage/error.interface";
import {getManager} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";

@Component()
export class ClassifyService{
    constructor(@Inject('ClassifyRepositoryToken') private readonly repository:Repository<ClassifyEntity>,
                @Inject('ArticleRepositoryToken') private readonly artRepository:Repository<ArticleEntity>,
                @Inject('PageClassifyRepositoryToken') private readonly pageRepository:Repository<PageClassifyEntity>){}

    /**
     * 新增分类
     * @param {ClassifyEntity} entity
     * @param {string} parent
     * @returns {Promise<ClassifyEntity[]>}
     */
    async createClassify(entity:ClassifyEntity,useFor:string):Promise<ClassifyEntity[]>{
        if(useFor=='art'){
            let newClassify:ClassifyEntity[] = await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:-entity.classifyAlias}).getMany();
            //别名不能重复
            if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
            let parentClassify:ClassifyEntity = await this.repository.findOneById(entity.groupId);
            //通过父级别名确定父级是否存在
            if(entity.groupId!=0 && entity.groupId!=null && parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
            if(entity.groupId==0){
                entity.groupId=null;
            }
            let classify:ClassifyEntity=entity;
            this.repository.insert(classify);
        }else if(useFor=='page'){
            let newClassify:ClassifyEntity[] = await this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:-entity.classifyAlias}).getMany();
            //别名不能重复
            if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
            let parentClassify:ClassifyEntity = await this.pageRepository.findOneById(entity.groupId);
            //通过父级别名确定父级是否存在
            if(entity.groupId!=0 && entity.groupId!=null && parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
            if(entity.groupId==0){
                entity.groupId=null;
            }
            let classify:ClassifyEntity=entity;
            this.pageRepository.insert(classify);
        }

       return this.findAllClassify(useFor);
    }

    /**
     * 修改分类
     * @param {ClassifyEntity} entity
     * @returns {Promise<ClassifyEntity[]>}
     */
    async updateClassify(entity:ClassifyEntity,useFor:string):Promise<ClassifyEntity[]>{
        if(useFor=='art'){
            //当前Id是否存在
            let classify:ClassifyEntity = await this.repository.findOneById(entity.id);
            if(classify==null) throw new MessageCodeError('update:classify:updateById');
            let newClassify:ClassifyEntity[] = await this.repository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:entity.classifyAlias}).getMany();
            //别名不能重复
            if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
            let parentClassify:ClassifyEntity = await this.repository.findOneById(entity.groupId);
            //通过父级别名确定父级是否存在
            if(parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
            entity.updateAt =new Date();
            let finalClassify:ClassifyEntity =entity;
            await this.repository.updateById(entity.id,finalClassify);
        }else if(useFor=='page'){
            //当前Id是否存在
            let classify:ClassifyEntity = await this.pageRepository.findOneById(entity.id);
            if(classify==null) throw new MessageCodeError('update:classify:updateById');
            let newClassify:ClassifyEntity[] = await this.pageRepository.createQueryBuilder().where('"classifyAlias"= :classifyAlias',{classifyAlias:entity.classifyAlias}).getMany();
            //别名不能重复
            if(newClassify.length>0) throw new MessageCodeError('create:classify:aliasRepeat');
            let parentClassify:ClassifyEntity = await this.pageRepository.findOneById(entity.groupId);
            //通过父级别名确定父级是否存在
            if(parentClassify==null) throw new MessageCodeError('create:classify:parentIdMissing');
            entity.updateAt =new Date();
            let finalClassify:ClassifyEntity =entity;
            await this.pageRepository.updateById(entity.id,finalClassify);
        }
        return this.findAllClassify(useFor);
     }

    /**
     * 查找所有分类
     * @param {number} id
     * @returns {Promise<ClassifyEntity[]>}
     */
    async findAllClassify(useFor:string):Promise<ClassifyEntity[]>{
        let classify:ClassifyEntity[]=[];
        if(useFor=='art'){
            await getManager().query("update public.classify set \"parentId\" = \"groupId\"");
             classify=await this.repository.createQueryBuilder('classify').innerJoinAndSelect('classify.childrens','childrens').orderBy('classify.id').getMany();
            // console.log('classify='+JSON.stringify(classify));
        }else if(useFor=='page'){
            await getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
            classify=await this.pageRepository.createQueryBuilder('page_classify_table').innerJoinAndSelect('page_classify_table.childrens','childrens').orderBy('page_classify_table.id').getMany();
        }

        let finalArray:ClassifyEntity[]=await this.recursion(this.deletegroup(0,classify));
        console.log('finalArray='+JSON.stringify(finalArray));
        return classify;
    }

    /**
     * 无极限分类
     * @param {ClassifyEntity[]} entity
     * @returns {Promise<ClassifyEntity[]>}
     */
    async recursion(entity:ClassifyEntity[]):Promise<ClassifyEntity[]>{
        let returnArray:ClassifyEntity[]=[];
        for(let t in entity){
            let firstArray:ClassifyEntity[] = entity[t].childrens;
            for(let h in firstArray){
                let num:number =firstArray[h].id;
                for(let m in entity){
                    if(num == entity[m].id){
                        firstArray[h].childrens = entity[m].childrens;
                        entity[t].childrens=firstArray;
                        returnArray.push(entity[t]);
                       // console.log('deletegroup='+JSON.stringify(this.deletegroup(num,entity)));
                        /*this.recursion(*//*this.deletegroup(num,entity)*//*);*/
                    }
                }
            }

        }
        //console.log('returnArray='+JSON.stringify(returnArray));
        return returnArray;
    }

    /**
     * 数组删除数据
     */
    deletegroup(id:number,entity:ClassifyEntity[]){
        let array:ClassifyEntity[]=[];
        for(let t in entity){
            if(entity[t].id!=id){
                console.log('删除数据'+id);
                array.push(entity[t]);
            }
        }
        return array;
    }


    /**
     * 通过Id删除分类及对应的子分类
     * @param {number} id
     * @returns {Promise<ClassifyEntity[]>}
     */
    async deleteClassify(id:number,useFor:string):Promise<ClassifyEntity[]>{
        if(useFor=='art'){
            let classify:ClassifyEntity = await this.repository.findOneById(id);
            if(classify==null) throw new MessageCodeError('update:classify:updateById');
            await getManager().query("update public.classify set \"parentId\" = \"groupId\"");
            const result =await this.repository.createQueryBuilder('classify').innerJoinAndSelect('classify.childrens','childrens').orderBy('classify.id').getMany();
            let resultArray:ClassifyEntity[]=result;
            console.log('deleteResult='+JSON.stringify(resultArray));
            await getManager().query("update public.classify set \"parentId\"=null");
            let deleteArray:number[]=[];
            for (let t in result){
                let num = result[t].id;
                if(num==id){
                    deleteArray.push(id);
                    let array:ClassifyEntity[]= result[t].childrens;
                    if(array.length>0){
                        for(let h in array){
                            let numH = array[h].id;
                            deleteArray.push(numH);
                            await this.repository.deleteById(numH);
                        }
                    }
                    await this.repository.deleteById(num);
                }
            }
            this.updateArticleClassify(deleteArray);
        }else if(useFor=='page'){
            let classify:ClassifyEntity = await this.pageRepository.findOneById(id);
            if(classify==null) throw new MessageCodeError('update:classify:updateById');
            await getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
            const result =await this.pageRepository.createQueryBuilder('page_classify_table').innerJoinAndSelect('page_classify_table.childrens','childrens').orderBy('page_classify_table.id').getMany();
            let resultArray:ClassifyEntity[]=result;
            console.log('deleteResult='+JSON.stringify(resultArray));
            await getManager().query("update public.page_classify_table set \"parentId\"=null");
            let deleteArray:number[]=[];
            for (let t in result){
                let num = result[t].id;
                if(num==id){
                    deleteArray.push(id);
                    let array:ClassifyEntity[]= result[t].childrens;
                    if(array.length>0){
                        for(let h in array){
                            let numH = array[h].id;
                            deleteArray.push(numH);
                            await this.pageRepository.deleteById(numH);
                        }
                    }
                    await this.pageRepository.deleteById(num);
                }
            }
            this.updateArticleClassify(deleteArray);
        }

        //await this.repository.deleteById(id);
        return this.findAllClassify(useFor);
    }

    /**
     * 删除分类后，修改文章状态为默认分类。需要新建一个分类为默认
     * @param {number[]} classifyArray
     * @returns {Promise<void>}
     */
    async updateArticleClassify(classifyArray:number[]){
        for(let t in classifyArray){
            let article:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId',{classifyId:classifyArray[t]}).getMany();
            for(let h in article){
                let newArticle:ArticleEntity=article[h];
                newArticle.classifyId=null;
                newArticle.classify=null;
                newArticle.updateAt =new Date();
                this.artRepository.updateById(newArticle.id,newArticle);
            }
        }
        return;
    }

    /**
     * 查找分类是否存在
     * @param {number} id
     * @param {string} useFor
     * @returns {Promise<ClassifyEntity>}
     */
    async findOneById(id:number,useFor:string):Promise<ClassifyEntity>{
        let entity:ClassifyEntity;
        if(useFor=='art'){
            entity=await this.repository.findOneById(id);
        }else if(useFor=='page'){
            entity=await this.pageRepository.findOneById(id);
        }
        return entity;
    }

    /**
     * 显示子级分类文章
     * @param {number} id
     * @returns {Promise<ArticleEntity[]>}
     */
    async showNextTitle(id:number):Promise<ArticleEntity[]>{
        let arrayNum:number[] = [];
        let classifications:ClassifyEntity[]=await this.repository.createQueryBuilder().where('"groupId"= :groupId',{groupId:id}).getMany();
        for(let t in classifications){
            arrayNum.push(classifications[t].id);
        }
        let articles:ArticleEntity[]=[];
        for(let h in arrayNum){
            let art:ArticleEntity[]=await this.artRepository.createQueryBuilder().where('"classifyId"= :classifyId',{classifyId:arrayNum[h]}).getMany();
            articles.push(...art);
        }
        return articles;
    }
}