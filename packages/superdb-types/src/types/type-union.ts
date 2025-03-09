import * as zjson from '../zjson';
import { DecodeStream } from '../decode-stream';
import { EncodeStream } from '../encode-stream';
import { Union } from '../values/union';
import { TypeNull } from './type-null';
import { Type } from './types';

export class TypeUnion implements Type {
  kind = 'union';
  id?: number | string;

  constructor(public types: Type[]) {}

  static stringify(types: Type[]) {
    return `(${types.map((t) => t.toString()).join(',')})`;
  }

  create(value: zjson.UnionValue, stream: DecodeStream) {
    if (value === null) {
      return new Union(this, TypeNull, null, null);
    } else {
      const index = parseInt(value[0]);
      const innerType = this.types[index];
      const innerValue = innerType.create(value[1], stream);
      return new Union(this, innerType, index, innerValue);
    }
  }

  serialize(stream: EncodeStream): zjson.NoId<zjson.UnionType> {
    return {
      kind: 'union',
      types: this.types.map((t) => stream.encodeType(t)),
    };
  }

  toString() {
    return `(${this.types.map((t) => t.toString()).join(',')})`;
  }
}
