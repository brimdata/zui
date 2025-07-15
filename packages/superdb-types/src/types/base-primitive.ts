import * as jsup from '../jsup';
import { DecodeStream } from '../decode-stream';
import { Value } from '../values/types';
import { Type } from './types';

export abstract class BasePrimitive<_T> implements Type {
  kind = 'primitive';
  abstract name: string;
  abstract create(value: jsup.Value, stream: DecodeStream): Value;

  serialize(): jsup.PrimitiveType {
    return { kind: 'primitive', name: this.name };
  }

  toString() {
    return this.name;
  }
}
