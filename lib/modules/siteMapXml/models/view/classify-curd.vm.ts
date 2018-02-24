import {ClassifyEntity} from "../../../entity/classify.entity";

export class ClassifyCurdVm{
    //适用于
    public useFor:string;
    //创建分类
    public createClassify?:ClassifyEntity;
    //修改分类
    public updateClassify?:ClassifyEntity;
    //删除分类
    public deleteClassify?:number;
    //移动分类
    public mobileClassifyId?:{id:number,parentId:number};
}