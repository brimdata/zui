import { isContainer } from './is-container';
import { isPrimitive } from './is-primitive';

export function isValue(value: unknown) {
  return isPrimitive(value) || isContainer(value);
}
