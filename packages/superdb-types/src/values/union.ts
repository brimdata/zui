import * as zjson from '../zjson';
import { EncodeStream } from '../encode-stream';
import { TypeUnion } from '../types/type-union';
import { Type } from '../types/types';
import { isNull } from '../utils/is-null';
import { Value } from './types';

export class Union implements Value {
  constructor(
    public type: TypeUnion,
    public innerType: Type,
    public index: number | null,
    public value: Value | null
  ) {}

  toString() {
    if (isNull(this.value)) return 'null';
    return this.value.toString();
  }

  serialize(stream: EncodeStream) {
    if (isNull(this.index) || isNull(this.value)) return null;
    return [
      this.index.toString(),
      stream.encodeValue(this.value),
    ] as zjson.UnionValue;
  }

  isUnset() {
    return isNull(this.index) || isNull(this.value);
  }

  toJS() {
    if (this.isUnset()) return null;
    return this.value?.toJS();
  }
}
