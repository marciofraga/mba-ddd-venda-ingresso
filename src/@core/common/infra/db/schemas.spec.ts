import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerSchema } from './schemas';
import { Partner } from '../../../events/domain/entities/partner.entity';

test('Deve criar um partner', async() => {
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

  const partner = Partner.create({name: 'Partner 1'});
  console.log(partner.id);
  em.persist(partner);
  await em.flush();
  await em.clear();

  const partnerFound = await em.findOne(Partner, {id: partner.id});
  console.log(partnerFound);

  await orm.close();

});