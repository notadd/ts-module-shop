import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
    modules: [TypeOrmModule.forFeature([])],
    components: [
        
    ],
    controllers: [],
    exports: []
})
export class ShopModule { }