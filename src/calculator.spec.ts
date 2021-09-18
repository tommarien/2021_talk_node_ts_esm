import { test, expect, jest } from '@jest/globals';
import { sum } from './calc.js';

const mockSum = jest.fn<ReturnType<typeof sum>, Parameters<typeof sum>>();

jest.unstable_mockModule('./calc.ts', () => ({
  sum: mockSum,
}));

const { total } = await import('./calculator.js');

test('it sums the given values', () => {
  mockSum.mockReturnValue(2);

  expect(total(1, 2, 3)).toBe(2);

  expect(mockSum).toHaveBeenCalledTimes(3);

  expect(mockSum).toHaveBeenCalledWith(0, 1);
  expect(mockSum).toHaveBeenCalledWith(2, 2);
  expect(mockSum).toHaveBeenCalledWith(2, 3);
});
