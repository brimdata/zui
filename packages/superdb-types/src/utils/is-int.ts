import { Int16 } from '../values/int16';
import { Int32 } from '../values/int32';
import { Int64 } from '../values/int64';
import { Int8 } from '../values/int8';
import { ZedInt } from '../values/types';
import { Uint16 } from '../values/uint16';
import { Uint32 } from '../values/uint32';
import { Uint64 } from '../values/uint64';
import { Uint8 } from '../values/uint8';

export function isInt(value: unknown): value is ZedInt {
  return (
    value instanceof Int64 ||
    value instanceof Int32 ||
    value instanceof Int16 ||
    value instanceof Int8 ||
    value instanceof Uint64 ||
    value instanceof Uint32 ||
    value instanceof Uint16 ||
    value instanceof Uint8
  );
}
