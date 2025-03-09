import { Time } from '../values/time';

export function isTime(value: unknown): value is Time {
  return value instanceof Time;
}
