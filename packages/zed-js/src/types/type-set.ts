import * as zjson from '../zjson';
import { SetValue } from '../zjson';
import { DecodeStream } from '../decode-stream';
import { EncodeStream } from '../encode-stream';
import { isNull } from '../utils/is-null';
import { Set } from '../values/set';
import { Type } from './types';

export class TypeSet implements Type {
  kind = 'set';

  constructor(public type: Type) {}

  static stringify(type: Type) {
    return `|[${type.toString()}]|`;
  }

  create(values: SetValue, stream: DecodeStream) {
    return new Set(
      this,
      isNull(values) ? null : values.map((v) => this.type.create(v, stream))
    );
  }

  serialize(stream: EncodeStream): zjson.NoId<zjson.SetType> {
    return {
      kind: 'set',
      type: stream.encodeType(this.type),
    };
  }

  toString() {
    return `|[` + this.type.toString() + `]|`;
  }
}
