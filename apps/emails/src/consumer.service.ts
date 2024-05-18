import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ConsumerService {

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'PartnerCreatedIntegrationEvent',
    queue: 'emails',
  })
  handle(msg: any): void {
    console.log('ConsumerService.handle', msg);
  }
}