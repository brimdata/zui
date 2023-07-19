import { Array } from '../values/array';
import { Set } from '../values/set';

export function isIterable(value: unknown): value is Array | Set {
  return value instanceof Array || value instanceof Set;
}
