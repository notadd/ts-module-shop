import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('sitemap_entity_table')
export class SitemapEntity{
    //基本配置Id
    @PrimaryGeneratedColumn() id:number;
    //文件名
    @Column({length:20})
    lc_XML_FileName:string;
    //生成xml地图
    @Column({nullable:true})
    lc_is_Enabled_XML_Sitemap:boolean;
    //只更新最近文章(1000以内)
    @Column({nullable:true})
    lc_post_limit1000:boolean;
    //链接包括：文章
    @Column({nullable:true})
    lc_post_select:boolean;
    //链接包括：页面
    @Column({nullable:true})
    lc_page_select:boolean;
    //当发布文章时更新
    @Column({nullable:true})
    lc_is_update_sitemap_when_post:boolean;
    //是否开启
    @Column({nullable:true})
    open:boolean;
    //创建时间
    @CreateDateColumn() createAt:Date;

}
