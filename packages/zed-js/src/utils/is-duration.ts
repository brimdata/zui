import { Duration } from '../values/duration';

export function isDuration(value: unknown): value is Duration {
  return value instanceof Duration;
}
