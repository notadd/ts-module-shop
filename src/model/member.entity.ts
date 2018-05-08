import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";

/* 会员实体类 */
@Entity("member")
export class Member {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20, unique: true })
    name: string;

    @Column({ length: 20 })
    realName: string;

    @Column({ length: 20 })
    email: string;

    @Column({ length: 10 })
    sex: string;

    @Column({ length: 20 })
    idNumber: string;

    @Column()
    birthday: Date;

    @Column({ length: 20 })
    password: string;

    @Column({ length: 20 })
    mobilePhone: string;

}
