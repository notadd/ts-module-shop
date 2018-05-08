import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index, OneToOne } from "typeorm";
import { Brand } from "./brand.entity";

/* 品牌logo实体*/
@Entity("brand_logo")
@Index("brand_id", ["brandId"])
export class BrandLogo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    bucketName: string;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 20
    })
    type: string;

    @Column()
    brandId: number;

    /* 品牌删除时，logo实体级联删除 */
    @OneToOne(type => Brand, brand => brand.logo, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "CASCADE",
        nullable: false,
        lazy: false,
        eager: false
    })
    @JoinColumn({
        name: "brandId",
        referencedColumnName: "id"
    })
    brand: Brand;
}
