
import { Event } from "../entities/event.entity";
import { IRepository } from '../../../common/domain/repository-interface';

export interface IEventRepository extends IRepository<Event> {}