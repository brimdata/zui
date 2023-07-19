import { Type } from '../types/types';
import { isTypeAlias } from './is-type-alias';

export function isNamed(type: Type, name: string) {
  return isTypeAlias(type) && type.name === name;
}
