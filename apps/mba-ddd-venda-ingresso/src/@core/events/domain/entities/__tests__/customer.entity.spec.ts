import { Customer, CustomerId } from '../customer.entity';
import Cpf from '../../../../common/domain/value-objects/cpf.vo';

test('deve criar um cliente', () => {

  const customer = Customer.create({
    cpf: '90442807082',
    name: 'aaaaaaa',
  });

  console.log(customer);
  expect(customer.cpf.value).toBe('90442807082');
  expect(customer.name).toBe('aaaaaaa');
  expect(customer.id).toBeDefined();
  expect(customer.id).toBeInstanceOf(CustomerId);

  const customer2 = new Customer({
    id: new CustomerId(customer.id.value),
    name: 'João',
    cpf: new Cpf('90442807082')
  });

  console.log(customer.equals(customer2));
  // console.log(customer.equals(1 as any));
});
