import { IDomainEventHandler } from '../../../common/application/domain-event-handler.interface';
import { PartnerCreated } from '../../domain/domain-events/partner-created.event';
import { IPartnerRepository } from '../../domain/repositories/partner-repository.interface';
import { DomainEventManager } from '../../../common/domain/domain-event-manager';

export class MyHandlerHandler implements IDomainEventHandler {

  constructor(private partnerRepo: IPartnerRepository,
              private domainEventManager: DomainEventManager) {}

  async handle(event: PartnerCreated): Promise<void> {
    // Do something with the event
  }

  static listensTo(): string[] {
    return [PartnerCreated.name];
  }
}