import { TypeAlias } from '../types/type-alias';

export function isTypeAlias(type: unknown): type is TypeAlias {
  return type instanceof TypeAlias;
}
