import {Float64} from "../values/float64"

export function isFloat64(value: unknown): value is Float64 {
  return value instanceof Float64
}
