import {Column, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";

@Entity('history')
export class DeleteEntity{
    @PrimaryColumn() id:number;
    //删除文章Id
    @Column() articleId:number;
    //文章名称
    @Column({length:120}) articleName:string;
    //删除时间
    @UpdateDateColumn() deleteAt:Date;
}