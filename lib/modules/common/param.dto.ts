import {ApiModelProperty} from "@nestjs/swagger";
import {IsString,IsInt,IsBoolean} from 'class-validator';
export enum EnvConfig{
    global,
    current,
    level1,
    level2,
    level3
}
export class GetLimit{
    @ApiModelProperty({type:Number})
    @IsInt()
    readonly limitNumber;

    @ApiModelProperty({type:Boolean})
    @IsBoolean()
    readonly hidden;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly pages;
}
export class GetClassifyLimit{
    @ApiModelProperty({type:Number})
    @IsInt()
    readonly id;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly limitNumber;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly pages;
}
export class GetLimitNum{
    @ApiModelProperty({type:Number})
    @IsInt()
    readonly limitNumber;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly pages;
}
export class KeyWords{
    @ApiModelProperty({type:Number})
    @IsInt()
    readonly limitNumber;

    @ApiModelProperty({type:String})
    @IsString()
    readonly keyWords;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly pages;
}

export class DeleteArticleId{
    @ApiModelProperty({type:Array})
    @IsInt()
    readonly id;
    @ApiModelProperty({type:Number})
    @IsInt()
    readonly limitNumber;
}

export class CreateArticle{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly name;

    @ApiModelProperty({type:String})
    @IsString()
    readonly content;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly classifyId;

    @ApiModelProperty({type:String})
    @IsString()
    readonly classifyName;

    @ApiModelProperty({type:String})
    @IsString()
    readonly abstractArticle;

    @ApiModelProperty({type:String})
    @IsString()
     topPlace:EnvConfig;

    @ApiModelProperty({type:Boolean,required:true})
    @IsBoolean()
    readonly hidden;

    @ApiModelProperty({type:String})
    @IsString()
    readonly publishedTime;

    @ApiModelProperty({type:String})
    @IsString()
    readonly source;

    @ApiModelProperty({type:String})
    @IsString()
    readonly sourceUrl;

}

export class UpdateArticle{
    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly id;

    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly name;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly classifyId;

    @ApiModelProperty({type:String})
    @IsString()
    readonly classifyName;


    @ApiModelProperty({type:String})
    @IsString()
    readonly content;

    @ApiModelProperty({type:String})
    @IsString()
    readonly abstractArticle;

    @ApiModelProperty({type:String,required:true})
    @IsString()
     topPlace:EnvConfig;

    @ApiModelProperty({type:Boolean,required:true})
    @IsBoolean()
    readonly hidden;

    @ApiModelProperty({type:String})
    @IsString()
    readonly publishedTime;

    @ApiModelProperty({type:String})
    @IsString()
    readonly source;

    @ApiModelProperty({type:String})
    @IsString()
    readonly sourceUrl;

}
export class GetClassify{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly usedFor;
    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly id;
}


export class CreateClassify{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly usedFor;

    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly classifyName;

    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly classifyAlias;

    @ApiModelProperty({type:String})
    @IsString()
    readonly chainUrl;

    @ApiModelProperty({type:String})
    @IsString()
    readonly describe;

    @ApiModelProperty({type:String})
    @IsString()
    readonly color;

    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly parentId;
}

export class UpdateClassify{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly usedFor;

    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly id;

    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly classifyName;

    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly classifyAlias;

    @ApiModelProperty({type:String})
    @IsString()
    readonly chainUrl;

    @ApiModelProperty({type:String})
    @IsString()
    readonly describe;

    @ApiModelProperty({type:String})
    @IsString()
    readonly color;

    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly parentId;
}

export class DeleteDto{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly usedFor;

    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly id;
}

export class showNextDto{
    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly id;

}
export class PageSerach{
    @ApiModelProperty({type:String})
    @IsString()
    readonly keyWords;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly limitNum;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly pages;

}
export class MobileClassify{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly usedFor;

    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly id;

    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly parentId;
}
export class CreatePage{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly title;

    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly alias;

    @ApiModelProperty({type:Array})
    @IsString()
    readonly content;

    @ApiModelProperty({type:Boolean,required:true})
    @IsBoolean()
    readonly open;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly classify;

}
export class ContentMap{
    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly id;

    @ApiModelProperty({type:String})
    @IsString()
    readonly content;
}

export class UpdatePage{
    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly id;

    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly title;

    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly alias;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly classify;

    @ApiModelProperty({type:ContentMap})
    readonly contents:[ContentMap]

}
