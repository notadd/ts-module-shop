import { InputEvaluationImage } from "../interface/evaluation/input.evaluation.image";
import { UserComponent } from "@notadd/user";
import { EvaluationImage } from "../model/evaluation.image.entity";
import { StoreComponent } from "../interface/store.component";
import { Repository, Connection } from "typeorm";
import { Evaluation } from "../model/evaluation.entity";
import { OrderItem } from "../model/order.item.entity";
import { Goods } from "../model/goods.entity";
export declare class EvaluationService {
    private readonly connection;
    private readonly userComponent;
    private readonly goodsRepository;
    private readonly storeComponent;
    private readonly orderItemRepository;
    private readonly evaluationRepository;
    private readonly evaluationImageRepository;
    constructor(connection: Connection, userComponent: UserComponent, goodsRepository: Repository<Goods>, storeComponent: StoreComponent, orderItemRepository: Repository<OrderItem>, evaluationRepository: Repository<Evaluation>, evaluationImageRepository: Repository<EvaluationImage>);
    getEvaluation(id: number): Promise<Evaluation>;
    getEvaluations(goodsId: number): Promise<Array<Evaluation>>;
    createEvaluation(content: string, userId: number, orderItemId: number, inputImages: Array<InputEvaluationImage>): Promise<void>;
    updateEvaluation(id: number, content: string, display: boolean): Promise<void>;
    deleteEvaluation(id: number): Promise<void>;
}
