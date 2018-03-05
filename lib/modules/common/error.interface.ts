import {HttpStatus} from "@nestjs/common";
export interface IErrorMessages{
    readonly type:string;
    readonly httpStatus:HttpStatus;
    readonly errorMessage:string;
    readonly userMessage:string;
}


export interface ResizeData{
    scale?:number
    wscale?:number
    hscale?:number
    width?:number
    height?:number
    pixel?:number
}
export interface Resize{
    mode:string
    data:ResizeData
}

export interface Tailor{
    isBefore:boolean
    width:number
    height:number
    x:number
    y:number
    gravity:string
}
export interface Blur{
    redius:number
    sigma:number
}

export interface ImagePreProcessInfo{
    resize?:Resize
    tailor?:Tailor
    watermark?:boolean
    rotate?:number
}
export interface ImagePostProcessInfo{
    resize?:Resize
    tailor?:Tailor
    watermark?:boolean
    rotate?:number
    blur?:Blur
    sharpen?:boolean
    format?:string
    lossless?:boolean
    quality?:number
    progressive?:boolean
    strip?:boolean
}