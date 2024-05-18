
import { PartnerId } from "../entities/partner.entity";
import { IDomainEvent } from '../../../common/domain/domain-event';

export class PartnerChangedName implements IDomainEvent {
    readonly event_version: number = 1;
    readonly occurred_on: Date;
  
    constructor(readonly aggregate_id: PartnerId, readonly name: string) {
      this.occurred_on = new Date();
    }
  }