import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('information')
export class InformationEntity{
    //信息项Id
    @PrimaryGeneratedColumn() id:number;
    //信息项名称
    @Column({nullable:false,length:200}) informationName:string;
    //信息项介绍
    @Column({nullable:true,length:200}) introduce:string;
    //信息项类型
    @Column({length:100}) type:string;
    //是否必填
    @Column() mandatory:boolean;
    //排序
    @Column({nullable:true}) sort:number


}
