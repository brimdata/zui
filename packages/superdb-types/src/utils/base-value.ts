import { Any } from '../index';
import { Union } from '../values/union';

export function baseValue(value: Any | null): Any | null {
  if (value instanceof Union) {
    return baseValue(value.value);
  }
  return value;
}
