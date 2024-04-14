import {EntityManager} from '@mikro-orm/mysql';
import { Order, OrderId } from 'src/@core/events/domain/entities/order.entity';
import { IOrderRepository } from 'src/@core/events/domain/repositories/order-repository.interface';


export class OrderMysqlRepository implements IOrderRepository {
    
    constructor(private entityManager: EntityManager) {}

    async add(entity: Order): Promise<void> {
        this.entityManager.persist(entity);
    }

    findById(id: string | OrderId): Promise<Order | null> {
        return this.entityManager.findOneOrFail(Order, {
            id: typeof id === 'string' ? new OrderId(id) : id,
        });
    }
    
    findAll(): Promise<Order[]> {
        return this.entityManager.find(Order, {});
    }

    async delete(entity: Order): Promise<void> {
        this.entityManager.remove(entity);
    }

}