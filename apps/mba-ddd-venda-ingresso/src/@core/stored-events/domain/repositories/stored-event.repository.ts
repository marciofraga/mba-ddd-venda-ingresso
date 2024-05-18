import { StoredEvent, StoredEventId } from '../entities/stored-event.entity';
import { IDomainEvent } from '../../../common/domain/domain-event';


export interface IStoredEventRepository {
  allBetween(
    lowEventId: StoredEventId,
    highEventId: StoredEventId
  ): Promise<StoredEvent[]>;

  allSince(eventId: StoredEventId): Promise<StoredEvent[]>;

  add(domainEvent: IDomainEvent): StoredEvent;
}