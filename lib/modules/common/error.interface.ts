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

export class ImagePreProcessInfo{
    public  resize?:Resize
    public tailor?:Tailor
    public watermark?:boolean
    public rotate?:number
}
export class RequestClass{
    private _host:string;


    set host(value: string) {
        this._host = value;
    }

    get host(): string {
        return this._host;
    }
}