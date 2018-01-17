import {Column, Entity, UpdateDateColumn} from "typeorm";

@Entity('history')
export class DeleteEntity{
    //删除文章Id
    @Column() id:number;
    //文章名称
    @Column({length:120}) name:string;
    //删除时间
    @UpdateDateColumn() deleteAt:Date;
}