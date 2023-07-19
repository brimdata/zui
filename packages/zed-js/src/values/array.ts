import { EncodeStream } from '../encode-stream';
import { TypeArray } from '../types/type-array';
import { isNull } from '../utils/is-null';
import { JSOptions, Value } from './types';

export class Array implements Value {
  constructor(public type: TypeArray, public items: Value[] | null) {}

  indexOf(value: Value) {
    if (isNull(this.items)) return -1;
    return this.items.indexOf(value);
  }

  at(index: number) {
    if (isNull(this.items)) return undefined;
    return this.items[index];
  }

  toString() {
    if (isNull(this.items)) return 'null';
    const contents = this.items.map((i) => i.toString()).join(',');
    return `[${contents}]`;
  }

  serialize(stream: EncodeStream) {
    if (isNull(this.items)) return null;
    return this.items.map((i) => stream.encodeValue(i));
  }

  isUnset() {
    return isNull(this.items);
  }

  toJS(opts: JSOptions = {}) {
    if (isNull(this.items)) return null;
    return this.items.map((i) => i.toJS(opts));
  }
}
