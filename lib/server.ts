import './vendor';
import { NestFactory } from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ApplicationModule} from "./modules/app.module";

/**
 * 跨域问题
 * @param req
 * @param res
 * @param next
 */
const cross =(req,res,next) =>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers","Content-Type,Authorization,Content-Length,X-Requested-With");
    if("OPTIONS" == req.method){
        res.sendStatus(200);
    }else{
        next();
    }
};
async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    var bodyParser=require('body-parser');
    app.use(cross);
    app.use(bodyParser.json({ limit:'10000kb'}));
    await app.listen(3000);
}
bootstrap().then(()=>console.log('Application is listening on port 3000'));
