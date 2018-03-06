
import { ExceptionFilter, Catch } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

/*错误码表
  
*/
@Catch(HttpException)
export class LocalExceptionFilter implements ExceptionFilter {

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
