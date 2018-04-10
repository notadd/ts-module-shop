import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Inject, HttpException, UseInterceptors } from '@nestjs/common';
import { PropertyValueService } from '../service/PropertyValueService';
import { Resolver, Query, Mutation } from '@nestjs/graphql'
import { Data } from '../interface/Data';
import { Request } from 'express';

@Resolver('PropertyValue')
export class PropertyValueResolver {

    constructor(
        @Inject(PropertyValueService) private readonly propertyValueService: PropertyValueService
    ) { }
}