import { sum } from './calc.js';

test('it adds both numbers', () => {
  expect(sum(1, 4)).toEqual(5);
});
