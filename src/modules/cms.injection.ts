import {MiddlewaresConsumer} from "@nestjs/common";
import {CqrsModule} from "./cqrsCms/cqrs.module";
import {RegistrationModule} from "./enter/registration.module";
import {LocalModule} from "./ext-local-store/src/LocalModule";
import { Module } from "@notadd/injection";

@Module({
    authors: [
        {
            email: "admin@notadd.com",
            username: "notadd",
        },
        {
            email: "1945320167@qq.com",
            username: "EricAll",
        },
    ],
    identification: "module-cms",
    name: "Module CMS",
    version: "2.0.2",
    imports :[
        CqrsModule,
        LocalModule,
        RegistrationModule,
    ],
})
export class CmsModule {
}
