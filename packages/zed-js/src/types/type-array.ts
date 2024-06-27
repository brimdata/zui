/* eslint-disable @typescript-eslint/no-array-constructor */
import * as zjson from '../zjson';
import { DecodeStream } from '../decode-stream';
import { EncodeStream } from '../encode-stream';
import { isNull } from '../utils/is-null';
import { Array } from '../values/array';
import { Type } from './types';

export class TypeArray implements Type {
  id?: number | string;
  kind = 'array';
  type: Type;

  constructor(type: Type) {
    this.type = type;
  }

  static stringify(type: Type) {
    return `[${type.toString()}]`;
  }

  create(values: zjson.ArrayValue | null, stream: DecodeStream) {
    return new Array(
      this,
      isNull(values)
        ? null
        : values.map((value) => this.type.create(value, stream))
    );
  }

  serialize(stream: EncodeStream): zjson.NoId<zjson.ArrayType> {
    return {
      kind: 'array',
      type: stream.encodeType(this.type),
    };
  }

  toString() {
    return '[' + this.type.toString() + ']';
  }
}
