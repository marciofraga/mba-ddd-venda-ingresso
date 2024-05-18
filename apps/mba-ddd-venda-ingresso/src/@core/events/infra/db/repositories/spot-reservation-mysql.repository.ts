import {EntityManager} from '@mikro-orm/mysql';
import { SpotReservation } from '../../../domain/entities/spot-reservation.entity';
import { EventSpotId } from '../../../domain/entities/event-spot';
import { ISpotReservationRepository } from '../../../domain/repositories/spot-reservation-repository.interface';


export class SpotReservationMysqlRepository implements ISpotReservationRepository {
    
    constructor(private entityManager: EntityManager) {}

    async add(entity: SpotReservation): Promise<void> {
        this.entityManager.persist(entity);
    }

    findById(id: string | EventSpotId): Promise<SpotReservation | null> {
        return this.entityManager.findOneOrFail(SpotReservation, {
            id: typeof id === 'string' ? new EventSpotId(id) : id,
        });
    }
    
    findAll(): Promise<SpotReservation[]> {
        return this.entityManager.find(SpotReservation, {});
    }

    async delete(entity: SpotReservation): Promise<void> {
        this.entityManager.remove(entity);
    }

}