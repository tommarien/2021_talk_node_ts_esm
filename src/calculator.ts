import { sum } from './calc.js';

export function total(...values: number[]): number {
  return values.reduce((previous, current) => sum(previous, current), 0);
}
