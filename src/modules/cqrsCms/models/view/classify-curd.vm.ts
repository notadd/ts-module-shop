import {ClassifyEntity} from "../../../entity/classify.entity";
import {PageClassifyEntity} from "../../../entity/pageClassify.entity";

export class ClassifyCurdVm{
    //适用于
    public useFor:string;
    //创建分类
    public createClassify?:{art?:ClassifyEntity,page?:PageClassifyEntity};
    //修改分类
    public updateClassify?:{art?:ClassifyEntity,page?:PageClassifyEntity};
    //删除分类
    public deleteClassify?:number;
    //移动分类
    public mobileClassifyId?:{id:number,parentId:number};
    //获取分类
    public getAllClassify?:boolean;
    //获取具体分类
    public getClassifyById?:{id:number,useFor:string}
}