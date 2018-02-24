export class GetPageParamCommand{
    constructor(
        //分页
        public limit:number,
        //第几页
        public pages:number,
        //关键字
        public keywords?:string,
        //分类id
        public classifyId?:number,
        //页面id
        public id?:number,
        //获取全部页面
        public getAll?:boolean){}
}