import { isTypeAlias } from './is-type-alias';

export function trueType(start: unknown) {
  let t = start;
  while (isTypeAlias(t)) {
    t = t.type;
  }
  return t;
}
