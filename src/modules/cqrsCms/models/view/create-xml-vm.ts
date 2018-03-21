export class CreateXmlVm{
    //生成xml地图
   lc_is_Enabled_XML_Sitemap:boolean;

    //xml文件名
   lc_XML_FileName:boolean;

    //只包括最近的文章(1000以内)
   lc_post_limit1000:boolean;

    //当发布文章时更新sitemap
   lc_is_update_sitemap_when_post:boolean;

    //链接包括：文章
    lc_post_select:boolean;

    //链接包括：页面
    lc_page_select:boolean;
}