import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";
import { BrandLogo } from "./brand.logo.entity";
import { Goods } from "./goods.entity";

@Entity("brand")
export class Brand {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20,
        unique: true
    })
    name: string;

    @OneToOne(type => BrandLogo, brandLogo => brandLogo.brand, {
        cascade: false,
        nullable: true
    })
    logo: BrandLogo;

    @OneToMany(type => Goods, goods => goods.brand, {
        cascade: false,
        lazy: false,
        eager: false
    })
    goodses: Array<Goods>;
}
