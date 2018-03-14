import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('site-rental-table')
export class SiteEntity{
    @PrimaryGeneratedColumn()
      id:number;

    //申请人
    @Column({nullable:true,length:50})
    applicant:string;

    //手机
    @Column({nullable:true})
    telPhone:number;

    //活动名称
    @Column({nullable:true,length:160})
    activityName:string;

    //活动日期
    @Column({nullable:true})
    eventDate:Date;

    //活动开始时间
    @Column({nullable:true})
    startTime:Date;

    //活动结束时间
    @Column({nullable:true})
    endTime:Date;

    //人数规模
    @Column({nullable:true,length:15})
    peopleScale:string;

    //场地选择
    @Column({nullable:true,length:22})
    siteSelection:string;

    //借用设备登记
    @Column({nullable:true,length:15})
    equipment:string;

    //活动介绍
    @Column({nullable:true,length:700})
    activityIntroduce:string;

    //主要嘉宾信息
    @Column({nullable:true,length:600})
    mainGuest:string;

    //拟邀媒体
    @Column({nullable:true,length:500})
    plansMedia:string;

    //备注说明
    @Column({nullable:true,length:700})
    descr:string;

    //无用
    @Column({nullable:true})
    collapse:boolean

}