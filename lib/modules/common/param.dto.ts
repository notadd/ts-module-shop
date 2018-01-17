import {ApiModelProperty} from "@nestjs/swagger";
import {IsString,IsInt} from 'class-validator';

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