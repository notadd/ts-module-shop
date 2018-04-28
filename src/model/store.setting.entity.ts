import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable, OneToMany, ManyToMany, ManyToOne } from "typeorm";

/* 商城设置实体类 */
@Entity("store_setting")
export class StoreSetting {

    @PrimaryGeneratedColumn()
    id: number;

    /* 商城logo存储空间名 */
    @Column({
        length: 20
    })
    logoBucketName: string;

    /* 商城logo图片名 */
    @Column({
        length: 100
    })
    logoName: string;

    /* 上传logo类型，即扩展名 */
    @Column({
        length: 20
    })
    logoType: string;

    /* 商城标题，在哪显示？ */
    @Column({
        length: 20
    })
    title: string;

    /* 所在地区 */
    @Column({
        length: 50
    })
    region: string;

    /* 详细地址 */
    @Column({
        length: 50
    })
    address: string;

    /* 是否关闭 */
    @Column()
    close: boolean;

    /* 关闭原因 */
    @Column({
        length: 50,
        nullable: true
    })
    closeReason: string;

    /* 服务电话s */
    @Column()
    servicePhone: string;
}