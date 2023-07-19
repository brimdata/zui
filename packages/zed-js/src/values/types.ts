import * as zjson from '../zjson';
import { EncodeStream } from '../encode-stream';
import { Type } from '../types/types';
import { Array } from './array';
import { Bool } from './bool';
import { BString } from './bstring';
import { Bytes } from './bytes';
import { Duration } from './duration';
import { Error } from './error';
import { Float64 } from './float64';
import { Int16 } from './int16';
import { Int32 } from './int32';
import { Int64 } from './int64';
import { Int8 } from './int8';
import { Ip } from './ip';
import { ZedMap } from './map';
import { Net } from './net';
import { Null } from './null';
import { Record } from './record';
import { Set } from './set';
import { String } from './string';
import { Time } from './time';
import { TypeValue } from './type-value';
import { Uint16 } from './uint16';
import { Uint32 } from './uint32';
import { Uint64 } from './uint64';
import { Uint8 } from './uint8';
import { Union } from './union';

export type ZedValue =
  | Array
  | Bool
  | BString
  | Bytes
  | Duration
  | Error
  | Float64
  | Int8
  | Int16
  | Int32
  | Int64
  | Ip
  | ZedMap
  | Net
  | Record
  | Set
  | String
  | Time
  | TypeValue
  | Uint8
  | Uint16
  | Uint32
  | Uint64
  | Union
  | Null;

export type ZedInt =
  | Uint8
  | Uint16
  | Uint32
  | Uint64
  | Int8
  | Int16
  | Int32
  | Int64;

export type JSOptions = {
  bigint?: boolean;
};

export interface Value {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJS(opts?: JSOptions): any;
  toString(): string;
  serialize(stream: EncodeStream): zjson.Value;
  isUnset(): boolean;
  type: Type;
}
