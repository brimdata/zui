import { Primitive } from '../values/primitive';

export function isPrimitive(value: unknown): value is Primitive {
  return value instanceof Primitive;
}
