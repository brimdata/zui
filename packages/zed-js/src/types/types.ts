import * as zjson from '../zjson';
import { DecodeStream } from '../decode-stream';
import { EncodeStream } from '../encode-stream';
import { Field } from '../index';
import { Value } from '../values/types';
import { TypeAlias } from './type-alias';
import { TypeArray } from './type-array';
import { TypeMap } from './type-map';
import { PrimitiveType } from './type-primitives';
import { TypeRecord } from './type-record';
import { TypeSet } from './type-set';
import { TypeUnion } from './type-union';

export type ZedType =
  | PrimitiveType
  | TypeRecord
  | TypeArray
  | TypeSet
  | TypeUnion
  | TypeMap
  | TypeAlias;

export type SerializeTypeDefs = {
  [key: string]: zjson.Type;
};

export interface Type {
  toString(): string;
  serialize(stream: EncodeStream): zjson.NoId<zjson.Type> | zjson.PrimitiveType;
  create(value: zjson.Value, stream: DecodeStream, parent?: Field): Value;
  kind: string;
}
