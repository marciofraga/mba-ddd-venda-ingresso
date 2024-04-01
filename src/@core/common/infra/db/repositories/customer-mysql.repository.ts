import {EntityManager} from '@mikro-orm/mysql';
import { Customer, CustomerId } from 'src/@core/events/domain/entities/customer.entity';
import { ICustomerRepository } from 'src/@core/events/domain/repositories/customer-repository.interface';


export class CustomerMysqlRepository implements ICustomerRepository {
    
    constructor(private entityManager: EntityManager) {}

    async add(entity: Customer): Promise<void> {
        this.entityManager.persist(entity);
    }

    findById(id: string | CustomerId): Promise<Customer | null> {
        return this.entityManager.findOneOrFail(Customer, {
            id: typeof id === 'string' ? new CustomerId(id) : id,
        });
    }
    
    findAll(): Promise<Customer[]> {
        return this.entityManager.find(Customer, {});
    }

    async delete(entity: Customer): Promise<void> {
        this.entityManager.remove(entity);
    }

}