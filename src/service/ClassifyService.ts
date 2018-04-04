import { SecondClassify } from '../model/SecondClassify.entity';
import { FirstClassify } from '../model/FirstClassify.entity';
import { ThirdClassify } from '../model/ThirdClassify.entity';
import { Component, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Component()
export class ClassifyService {

    constructor(
        @InjectRepository(FirstClassify) private readonly firstClassifyRepository: Repository<FirstClassify>,
        @InjectRepository(SecondClassify) private readonly secondClassifyRepository: Repository<SecondClassify>,
        @InjectRepository(ThirdClassify) private readonly thirdClassifyRepository: Repository<ThirdClassify>
    ) { }

    async createClassify(name: string, description: string, level: number): Promise<void> {

    }
}