
import { SpotReservation } from "../entities/spot-reservation.entity";
import { IRepository } from '../../../common/domain/repository-interface';


export interface ISpotReservationRepository extends IRepository<SpotReservation> {}