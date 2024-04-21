import { EventSpotId } from "./event-spot";
import { CustomerId } from "./customer.entity";
import { AggregateRoot } from '../../../common/domain/aggregate-root';

export type SpotReservationCreateCommand = {
    spot_id: EventSpotId | string;
    customer_id: CustomerId;
};

export type SpotReservationConstructorProps = {
    spot_id: EventSpotId | string;
    reservation_date?: Date;
    customer_id: CustomerId;
};

export class SpotReservation extends AggregateRoot {
    spot_id: EventSpotId | string;
    reservation_date: Date;
    customer_id: CustomerId;

    constructor(props: SpotReservationConstructorProps) {
        super();
        this.spot_id = 
            props.spot_id instanceof EventSpotId
            ? props.spot_id
            : new EventSpotId(props.spot_id);
        this.reservation_date = props.reservation_date;
        this.customer_id = 
            props.customer_id instanceof CustomerId
            ? props.customer_id
            : new CustomerId(props.customer_id);
    }
    
    static create(command: SpotReservationConstructorProps) {
        return new SpotReservation({
            spot_id: command.spot_id,
            reservation_date: new Date(),
            customer_id: command.customer_id
        
        });
    }

    changeReservation(customer_id: CustomerId) {
        this.customer_id = customer_id;
        this.reservation_date = new Date();
    }

    toJSON() {
        throw new Error("Method not implemented.");
    }

}