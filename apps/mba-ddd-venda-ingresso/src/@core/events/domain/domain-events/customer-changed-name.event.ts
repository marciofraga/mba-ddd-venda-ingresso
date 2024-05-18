import { CustomerId } from "../entities/customer.entity";
import { IDomainEvent } from '../../../common/domain/domain-event';


export class CustomerNameChanged implements IDomainEvent {
    readonly event_version: number = 1;
    readonly occurred_on: Date;
  
    constructor(readonly aggregate_id: CustomerId, readonly name: string) {
      this.occurred_on = new Date();
    }
  }