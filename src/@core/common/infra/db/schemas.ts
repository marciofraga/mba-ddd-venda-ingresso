import { Partner } from '../../../events/domain/entities/partner.entity';
import { EntitySchema } from '@mikro-orm/core';
import { PartnerIdSchemaType } from './types/partner-id.schema-type';

export const PartnerSchema = new EntitySchema<Partner>({
  class: Partner,
  properties: {
    id: { primary: true, entity: 'PartnerIdSchemaType' },
    name: { type: 'string', length: 255 },
  },
});