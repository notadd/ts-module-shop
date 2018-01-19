import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {InformationEntity} from "../entity/information.entity";

@Component('information')
export class InformationService{
    constructor(@Inject('InformationRepositoryToken') private readonly repository:Repository<InformationEntity>){}

    /**
     * 获取所有信息项
     * @returns {Promise<InformationEntity[]>}
     */
    async findAllInformation():Promise<InformationEntity[]>{
        let inforArray:InformationEntity[] =await this.repository.find();
        return inforArray;
    }
}