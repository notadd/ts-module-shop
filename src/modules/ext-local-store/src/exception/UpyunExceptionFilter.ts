
import { ExceptionFilter, Catch } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

/*错误码表
  200: 成功
  400：缺少参数或者参数不正确
  401：指定空间配置不存在
  402：restful请求错误
  403：数据库错误
  404：文件不存在
  405：图片处理错误
  406: 文件处理错误
  500：意外错误
*/
@Catch(HttpException)
export class UpyunExceptionFilter implements ExceptionFilter {

  catch(exception: HttpException, response) {
    let status = exception.getStatus()
    let message = exception.getResponse()
    response
      .status(status)
      .json({
        code: status,
        message: message
      }); 
  }
}