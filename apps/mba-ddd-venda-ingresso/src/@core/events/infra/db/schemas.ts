import { Cascade, EntitySchema } from '@mikro-orm/core';
import { Partner } from '../../../events/domain/entities/partner.entity';
import { Event } from '../../domain/entities/event.entity'
import { PartnerIdSchemaType } from './types/partner-id.schema-type';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerIdSchemaType } from './types/customer-id.schema-type';
import { CpfSchemaType } from './types/cpf.schema-type';
import { EventIdSchemaType } from './types/event-id.schema-type';
import { EventSection } from '../../domain/entities/event-section';
import { EventSpot } from '../../domain/entities/event-spot';
import { EventSpotIdSchemaType } from './types/event-spot-id.schema-type';
import { EventSectionIdSchemaType } from './types/event-section-id.schema-type';
import { SpotReservation } from '../../domain/entities/spot-reservation.entity';
import { Order, OrderId, OrderStatus } from '../../domain/entities/order.entity';
import { OrderIdSchemaType } from './types/order-id.schema-type';

export const PartnerSchema = new EntitySchema<Partner>({
  class: Partner,
  properties: {
    id: { primary: true, type: PartnerIdSchemaType },
    name: { type: 'string', length: 255 },
  },
});

export const CustomerSchema = new EntitySchema<Customer>({
  class: Customer,
  uniques: [{properties: ['cpf']}],
  properties: {
    id: { primary: true, type: CustomerIdSchemaType },
    cpf: { type: CpfSchemaType, length: 11 },
    name: { type: 'string', length: 255 },
  },
});

export const EventSchema = new EntitySchema<Event>({
  class: Event,
  properties: {
    id: { primary: true, type: EventIdSchemaType },
    name: { type: 'string', length: 255 },
    description: { type: 'text', nullable: true},
    date: { type: 'date' },
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    sections: {
      kind: '1:m',
      entity: () => EventSection,
      eager: true,
      cascade: [Cascade.ALL]
    },
    partner_id: {
      kind: 'm:1',
      entity: () => Partner,
      hidden: true,
      mapToPk: true,
      type: PartnerIdSchemaType,
    },
  },
});

export const EventSectionSchema = new EntitySchema<EventSection>({
  class: EventSection,
  properties: {
    id: { primary: true, type: EventSectionIdSchemaType },
    name: { type: 'string', length: 255 },
    description: { type: 'text', nullable: true},
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    price: { type: 'number', default: 0 },
    spots: {
      kind: '1:m',
      entity: () => EventSpot,
      mappedBy: (section) => section.event_section_id,
      eager: true,
      cascade: [Cascade.ALL]
    
    },
    event_id: {
      kind: 'm:1',
      entity: () => Event,
      hidden: true,
      mapToPk: true,
      type: EventIdSchemaType
    },
  },
});

export const EventSpotSchema = new EntitySchema<EventSpot>({
  class: EventSpot,
  properties: {
    id: {
      type: EventSpotIdSchemaType,
      primary: true,
    },
    location: { type: 'string', length: 255, nullable: true },
    is_reserved: { type: 'boolean', default: false },
    is_published: { type: 'boolean', default: false },
    event_section_id: {
      kind: 'm:1',
      entity: () => EventSection,
      hidden: true,
      mapToPk: true,
      type: EventSectionIdSchemaType,
    },
  },
});

export const SpotReservationSchema = new EntitySchema<SpotReservation>({
  class: SpotReservation,
  properties: {
    spot_id: { 
      customType: new EventSpotIdSchemaType(),
      primary: true,
      reference: 'm:1',
      entity: () => EventSpot,
      mapToPK: true,
    },
    reservation_date: { type: 'date' },
    customer_id: {
      reference: 'm:1',
      entity: () => Customer,
      mapToPk: true,
      hidden: true,
      inherited: true,
      customType: new CustomerIdSchemaType(),
    },
  },
});

export const OrderSchema = new EntitySchema<Order>({
  class: Order,
  properties: {
    id: { primary: true, customType: new OrderIdSchemaType() },
    amount: { type: 'number' },
    status: { enum: true, items: () => OrderStatus},
    customer_id: {
      reference: 'm:1',
      entity: () => Customer,
      mapToPk: true,
      hidden: true,
      inherited: true,
      customType: new CustomerIdSchemaType(),
    },
    
    event_spot_id: {
      reference: 'm:1',
      entity: () => EventSpot,
      mapToPk: true,
      hidden: true,
      inherited: true,
      customType: new EventSpotIdSchemaType(),
    },
  }
});