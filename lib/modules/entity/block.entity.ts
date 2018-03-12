import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/*街区入驻登记表*/
@Entity('block-entry-form')
export class BlockEntity{
    @PrimaryGeneratedColumn()
    id:number;
    //姓名
    @Column({nullable:true,length:200})
    username:string;

    //手机
    @Column({nullable:true})
    telPhone:number;

    //微信
    @Column({nullable:true,length:100})
    WeChat:string;

    //公司名称
    @Column({nullable:true,length:200})
    companyName:string;

    //所属行业
    @Column({nullable:true,length:130})
    industryInvolved:string;

    //公司人数
    @Column({nullable:true,length:30})
    employees:string;

    //公司介绍
    @Column({nullable:true,length:700})
    companyIntroduction:string;




}