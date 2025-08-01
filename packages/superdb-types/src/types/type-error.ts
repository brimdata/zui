import * as jsup from '../jsup';
import { DecodeStream } from '../decode-stream';
import { EncodeStream } from '../encode-stream';
import { Error } from '../values/error';
import { Type } from './types';
export class TypeError implements Type {
  kind = 'error';

  constructor(public type: Type) {}

  static stringify(type: Type) {
    return `error<${type.toString()}>`;
  }

  create(value: jsup.Value, stream: DecodeStream) {
    if (value === null) {
      return new Error(this, null);
    } else {
      return new Error(this, this.type.create(value, stream));
    }
  }

  serialize(stream: EncodeStream): jsup.NoId<jsup.ErrorType> {
    return {
      kind: 'error',
      type: stream.encodeType(this.type),
    };
  }

  toString(): string {
    return TypeError.stringify(this.type);
  }
}
