import { Partner } from '../entities/partner.entity';
import { IRepository } from '../../../common/domain/repository-interface';

export interface IPartnerRepository extends IRepository<Partner> {}