import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('page')
export class PageEntity{
    //页面id
    @PrimaryGeneratedColumn() id:number;
   //页面标题
    @Column({length:200}) title:string;
    //页面别名
    @Column({length:200}) alias:string;
    //是否开启
    @Column() open:boolean;
    //页面内容
    @Column({nullable:true,length:10000}) content:string;
    //页面分类
    @Column({nullable:true}) classify:number;
    //创建时间
    @CreateDateColumn() createAt:Date;
    //修改时间
    @UpdateDateColumn() updateAt:Date;
}