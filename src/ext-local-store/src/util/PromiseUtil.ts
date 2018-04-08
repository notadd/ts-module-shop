import { Component, Inject, HttpException } from '@nestjs/common';

/* Promise工具 */
@Component()
export class PromiseUtil{
    /* 保证Promise中抛出的异常可以被try-catch块正常接受到
       直接在.catch方法中抛出异常会出现意外状况
    */
    async do(fn:(resolve,reject)=>any){
        let ex: HttpException
        await new Promise(fn).catch(err => {
            ex = err
        })
        if (ex) {
            throw ex
        }
    }
}