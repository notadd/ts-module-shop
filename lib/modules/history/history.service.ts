import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {HistoryEntity} from "../entity/history.entity";

@Component()
export class HistoryService{
  constructor(@Inject('HistoryRepositoryToken') private readonly repository:Repository<HistoryEntity>){}

    /**
     * 删除文章(分类)记入历史表
     * @param {HistoryEntity} history
     */
   createHistory(history:HistoryEntity[]){
      for(let t in history){
          let newHis:HistoryEntity =history[t];
          newHis.deleteAt =new Date ;
          this.repository.insert(newHis);
      }
  }

}