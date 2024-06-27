import { Float16 } from '../values/float16';
import { Float32 } from '../values/float32';
import { Float64 } from '../values/float64';

export function isFloat64(value: unknown): value is Float64 {
  return value instanceof Float64;
}

export function isFloat(value: unknown): value is Float64 | Float32 | Float16 {
  return (
    value instanceof Float64 ||
    value instanceof Float32 ||
    value instanceof Float16
  );
}
