import {ApiModelProperty} from "@nestjs/swagger";
import {IsString,IsInt,IsBoolean,IsDate,IsUrl} from 'class-validator';
import {Url, URL} from "url";

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
    @ApiModelProperty({type:[Number]})
    @IsInt()
    readonly id;

}

export class CreateArticle{
    @ApiModelProperty({type:String})
    @IsString()
    readonly name;

    @ApiModelProperty({type:String})
    @IsString()
    readonly classify;

    @ApiModelProperty({type:String})
    @IsString()
    readonly abstractArticle;

    @ApiModelProperty({type:String})
    @IsString()
    readonly topPlace;

    @ApiModelProperty({type:Boolean})
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
    @ApiModelProperty({type:Number})
    @IsInt()
    readonly id;

    @ApiModelProperty({type:String})
    @IsString()
    readonly name;

    @ApiModelProperty({type:String})
    @IsString()
    readonly classify;

    @ApiModelProperty({type:String})
    @IsString()
    readonly abstractArticle;

    @ApiModelProperty({type:String})
    @IsString()
    readonly topPlace;

    @ApiModelProperty({type:Boolean})
    @IsBoolean()
    readonly hidden;

    @ApiModelProperty({type:Date})
    @IsDate()
    readonly publishedTime;

    @ApiModelProperty({type:String})
    @IsString()
    readonly source;

    @ApiModelProperty({type:String})
    @IsUrl()
    readonly sourceUrl;

}

export class CreateClassify{
    @ApiModelProperty({type:String})
    @IsString()
    readonly classifyName;

    @ApiModelProperty({type:String})
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
}