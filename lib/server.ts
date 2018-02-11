import './vendor';
import { NestFactory } from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ApplicationModule} from "./modules/app.module";

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    const options = new DocumentBuilder().setTitle('CMS example').setDescription('The CMS API description').setVersion('1.0').addTag('default').build();
    const document = SwaggerModule.createDocument(app,options);
    SwaggerModule.setup('/api',app,document);
    await app.listen(3000);
}
bootstrap().then(()=>console.log('Application is listening on port 3000'));
