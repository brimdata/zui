import { Type } from '../types/types';
import { isNull } from '../utils/is-null';
import { Value } from './types';

export abstract class Primitive implements Value {
  abstract type: Type;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract toJS(): any;

  constructor(public value: string | null = null) {}

  isUnset() {
    return isNull(this.value);
  }

  isSet() {
    return !this.isUnset();
  }

  toString() {
    if (isNull(this.value)) return 'null';
    return this.value.toString();
  }

  serialize() {
    if (isNull(this.value)) return null;
    return this.value.toString();
  }
}
