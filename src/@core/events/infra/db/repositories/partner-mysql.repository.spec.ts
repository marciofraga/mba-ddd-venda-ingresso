import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerMysqlRepository } from './partner-mysql.repository';
import { PartnerSchema } from '../../../common/infra/db/schemas';
import { Partner } from '../../../domain/entities/partner.entity';

test('partner repository', async() => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [PartnerSchema],
    host: 'localhost',
    port: 3306,
    dbName: 'events',
    user: 'root',
    password: 'root',
    forceEntityConstructor: true,
  });
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();
  const partnerRepo = new PartnerMysqlRepository(em);
  const partner = Partner.create({name: 'Partner 1'})
  await partnerRepo.add(partner);
  await em.flush();
  await em.clear();
  const partnerFound = await partnerRepo.findById(partner.id);
  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
});