
import { Order } from "../entities/order.entity";
import { IRepository } from '../../../common/domain/repository-interface';


export interface IOrderRepository extends IRepository<Order> {}