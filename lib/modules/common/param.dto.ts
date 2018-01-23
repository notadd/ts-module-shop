import {ApiModelProperty} from "@nestjs/swagger";
import {IsString,IsInt,IsBoolean,IsDate,IsUrl} from 'class-validator';
import {URL} from "url";
import {type} from "os";
export enum EnvConfig{
    global,
    current,
    Level1,
    Level2,
    Level3
}
export class GetLimit{
    @ApiModelProperty({type:Number})
    @IsInt()
    readonly limitNumber;
}

export class KeyWords{
    @ApiModelProperty({type:Number})
    @IsInt()
    readonly limitNumber;

    @ApiModelProperty({type:String})
    @IsString()
    readonly keyWords;
}

export class DeleteArticleId{
    @ApiModelProperty({type:Array})
    @IsInt()
    readonly id;

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

    @ApiModelProperty({type:URL})
    @IsUrl()
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
    readonly topPlace:EnvConfig;

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
    @IsUrl()
    readonly sourceUrl;

}
export class GetClassify{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly usedFor;
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

    @ApiModelProperty({type:Boolean,required:true})
    @IsBoolean()
    readonly showNext;
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

    @ApiModelProperty({type:Boolean,required:true})
    @IsBoolean()
    readonly showNext;
}

export class DeleteDto{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly usedFor;

    @ApiModelProperty({type:Number,required:true})
    @IsInt()
    readonly id;
}

export class PageSerach{
    @ApiModelProperty({type:String})
    @IsString()
    readonly keyWords;
}
export class CreatePage{
    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly title;

    @ApiModelProperty({type:String,required:true})
    @IsString()
    readonly alias;

    @ApiModelProperty({type:String})
    @IsString()
    readonly content;

    @ApiModelProperty({type:Boolean,required:true})
    @IsBoolean()
    readonly open;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly classify;

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

    @ApiModelProperty({type:String})
    @IsString()
    readonly content;

    @ApiModelProperty({type:Boolean,required:true})
    @IsBoolean()
    readonly open;

    @ApiModelProperty({type:Number})
    @IsInt()
    readonly classify;

}