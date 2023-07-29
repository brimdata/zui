import * as zjson from '../zjson';
import { DecodeStream } from '../decode-stream';
import { EncodeStream } from '../encode-stream';
import { isNull } from '../utils/is-null';
import { ZedMap } from '../values/map';
import { Type } from './types';

export class TypeMap implements Type {
  kind = 'union';

  constructor(public keyType: Type, public valType: Type) {}

  static stringify(keyType: Type, valType: Type) {
    return `|{` + keyType.toString() + ':' + valType.toString() + '}|';
  }

  create(value: [zjson.Value, zjson.Value][] | null, stream: DecodeStream) {
    return new ZedMap(
      this,
      isNull(value)
        ? null
        : new Map(
            value.map((entry) => [
              this.keyType.create(entry[0], stream),
              this.valType.create(entry[1], stream),
            ])
          )
    );
  }

  serialize(stream: EncodeStream): zjson.NoId<zjson.MapType> {
    return {
      kind: 'map',
      key_type: stream.encodeType(this.keyType),
      val_type: stream.encodeType(this.valType),
    };
  }

  toString() {
    return (
      '|{' + this.keyType.toString() + ':' + this.valType.toString() + '}|'
    );
  }
}
