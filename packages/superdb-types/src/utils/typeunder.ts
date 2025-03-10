import { Any } from '../index';
import { TypeAlias } from '../types/type-alias';

export function typeunder(value: Any): Any {
  if (value instanceof TypeAlias) {
    return typeunder(value.type);
  } else {
    return value;
  }
}
