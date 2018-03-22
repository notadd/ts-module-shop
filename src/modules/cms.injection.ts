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
    ],
    identification: "module-demo",
    name: "Module Demo",
    version: "2.0.0",
    imports :[
        CqrsModule,
        LocalModule,
        RegistrationModule,
    ],
})
export class CmsModule {
}
