import { Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema, OrderSchema,
  PartnerSchema, SpotReservationSchema,
} from '../@core/events/infra/db/schemas';
import { EntityManager } from '@mikro-orm/mysql';
import { PartnerMysqlRepository } from '../@core/events/infra/db/repositories/partner-mysql.repository';
import { CustomerMysqlRepository } from '../@core/events/infra/db/repositories/customer-mysql.repository';
import { EventMysqlRepository } from '../@core/events/infra/db/repositories/event-mysql.repository';
import { OrderMysqlRepository } from '../@core/events/infra/db/repositories/order-mysql.repository';
import { SpotReservationMysqlRepository } from '../@core/events/infra/db/repositories/spot-reservation-mysql.repository';
import { PaymentGateway } from '../@core/events/application/payment.gateway';
import { OrderService } from '../@core/events/application/order.service';
import { EventService } from '../@core/events/application/event.service';
import { PartnerService } from '../@core/events/application/partner.service';
import { IPartnerRepository } from '../@core/events/domain/repositories/partner-repository.interface';
import { CustomerService } from '../@core/events/application/customer.service';
import { IUnitOfWork } from '../@core/common/application/unit-of-work.interface';
import { PartnersController } from './partners/partners.controller';
import { CustomersController } from './customers/customers.controllers';
import { EventsController } from './events/events.controller';
import { ApplicationModule } from '../application/application.module';
import { ApplicationService } from '../@core/common/application/application.service';
import { DomainEventManager } from '../@core/common/domain/domain-event-manager';
import { PartnerCreated } from '../@core/events/domain/domain-events/partner-created.event';
import { MyHandlerHandler } from '../@core/events/application/handlers/my-handler.handler';
import { ModuleRef } from '@nestjs/core';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { IIntegrationEvent } from '../@core/common/domain/integration-event';
import { Queue } from 'bull';
import { Partner } from '../@core/events/domain/entities/partner.entity';
import { PartnerCreatedIntegrationEvent } from '../@core/events/domain/integration-events/partner-created.int-events';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CustomerSchema,
      PartnerSchema,
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema
    ]),
    ApplicationModule,
    BullModule.registerQueue({
      name: 'integration-events',
    })
  ],
  providers: [
    {
      provide: 'IPartnerRepository',
      useFactory: (em: EntityManager) => new PartnerMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'ICustomerRepository',
      useFactory: (em: EntityManager) => new CustomerMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'IEventRepository',
      useFactory: (em: EntityManager) => new EventMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'IOrderRepository',
      useFactory: (em: EntityManager) => new OrderMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'ISpotReservationRepository',
      useFactory: (em: EntityManager) => new SpotReservationMysqlRepository(em),
      inject: [EntityManager],
    },{
      provide: PartnerService,
      useFactory: (
        partnerRepo: IPartnerRepository,
        appService: ApplicationService,
      ) => new PartnerService(partnerRepo, appService),
      inject: ['IPartnerRepository', ApplicationService],
    },
    {
      provide: CustomerService,
      useFactory: (customerRepo, uow) => new CustomerService(customerRepo, uow),
      inject: ['ICustomerRepository', 'IUnitOfWork'],
    },
    {
      provide: EventService,
      useFactory: (eventRepo, partnerRepo, uow) =>
        new EventService(eventRepo, partnerRepo, uow),
      inject: ['IEventRepository', 'IPartnerRepository', 'IUnitOfWork'],
    },
    PaymentGateway,
    {
      provide: OrderService,
      useFactory: (
        orderRepo,
        customerRepo,
        eventRepo,
        spotReservationRepo,
        uow,
        paymentGateway,
      ) =>
        new OrderService(
          orderRepo,
          customerRepo,
          eventRepo,
          spotReservationRepo,
          uow,
          paymentGateway,
        ),
      inject: [
        'IOrderRepository',
        'ICustomerRepository',
        'IEventRepository',
        'ISpotReservationRepository',
        'IUnitOfWork',
        PaymentGateway,
      ],
    },
    {
      provide: MyHandlerHandler,
      useFactory: (
        partnerRepo: IPartnerRepository,
        domainEventManager: DomainEventManager,
      ) => new MyHandlerHandler(partnerRepo, domainEventManager),
      inject: ['IPartnerRepository', DomainEventManager],
    }
  ],
  controllers: [PartnersController, CustomersController, EventsController]
})
export class EventsModule implements OnModuleInit{
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
    @InjectQueue('integration-events')
    private integrationEventsQueue: Queue<IIntegrationEvent>
  ) {}

  onModuleInit(): any {
    console.log('EventsModule initialized');
    MyHandlerHandler.listensTo().forEach((eventName) => {
      this.domainEventManager.register(
        eventName,
        async (event: PartnerCreated) => {
          const handler: MyHandlerHandler = await this.moduleRef.resolve(MyHandlerHandler);
          await handler.handle(event);
        }
      );
    });
    this.domainEventManager.register(PartnerCreated.name, async (event) => {
      const integrationEvent = new PartnerCreatedIntegrationEvent(event);
      await this.integrationEventsQueue.add(integrationEvent);
    });
  }
}
