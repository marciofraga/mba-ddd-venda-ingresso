import { Name } from './name.vo';

test('deve criar um nome válido', () => {
  const name = new Name('aaaaaaa');
  expect(name.value).toBe('aaaaaaa');
});