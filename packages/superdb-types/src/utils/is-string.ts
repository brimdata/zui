import { String } from '../values/string';

export function isStringy(value: unknown): value is String {
  return value instanceof String;
}
