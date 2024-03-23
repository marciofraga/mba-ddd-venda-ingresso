import { IPartnerRepository } from '../../../domain/repositories/partner.repository.interface';
import { EntityManager } from '@mikro-orm/core';
import { Partner, PartnerId } from '../../../domain/entities/partner.entity';

export class PartnerMysqlRepository implements IPartnerRepository {

  constructor(private entityManager: EntityManager) {
  }

  async add(entity: Partner): Promise<void> {
    this.entityManager.persist(entity);
  }
  findById(id: any): Promise<Partner | null> {
    return this.entityManager.findOneOrFail(Partner, {
      id: typeof id === 'string' ? new PartnerId(id) : id,
    });
  }

  findAll(): Promise<Partner[]> {
    return this.entityManager.find(Partner, {});
  }

  async delete(entity: Partner): Promise<void> {
    this.entityManager.remove(entity);
  }
}

