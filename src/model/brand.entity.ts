import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";
import { BrandLogo } from "./brand.logo.entity";
import { Goods } from "./goods.entity";


@Entity("brand")
export class Brand {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: "name",
        length: 20,
        unique: true
    })
    name: string;

    @OneToOne(type => BrandLogo, brandLogo => brandLogo.brand, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: true
    })
    logo: BrandLogo;

    @OneToMany(type => Goods, goods => goods.brand, {
        cascadeInsert: false,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    goodses: Array<Goods>;
}