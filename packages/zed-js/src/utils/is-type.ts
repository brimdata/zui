import { isContainerType } from '../types/type-containers';
import { isPrimitiveType } from '../types/type-primitives';
import { Type } from '../types/types';

export function isType(value: unknown): value is Type {
  return isPrimitiveType(value) || isContainerType(value);
}
