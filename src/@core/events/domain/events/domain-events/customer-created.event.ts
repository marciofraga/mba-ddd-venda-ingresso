import { IDomainEvent } from "src/@core/common/domain/domain-event";
import { CustomerId } from "../../entities/customer.entity";
import Cpf from "src/@core/common/domain/value-objects/cpf.vo";

export class CustomerCreated implements IDomainEvent {
    readonly event_version: number = 1;
    readonly occurred_on: Date;

    constructor(
        readonly aggregate_id: CustomerId,
        readonly name: string,
        readonly cpf: Cpf
        ) {
        this.occurred_on = new Date();
    }
}