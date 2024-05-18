
import { Customer } from "../entities/customer.entity";
import { IRepository } from '../../../common/domain/repository-interface';


export interface ICustomerRepository extends IRepository<Customer> {}