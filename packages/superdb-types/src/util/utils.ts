import { Ts } from '../types';

function hasOwnProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function isObject(thing: unknown): thing is object {
  return typeof thing === 'object' && thing !== null;
}

export function isString(thing: unknown): thing is string {
  return typeof thing === 'string';
}

export function isDate(thing: unknown): thing is Date {
  return isObject(thing) && thing.constructor.name === 'Date';
}

export function isNumber(thing: unknown) {
  return typeof thing === 'number';
}

export function isBigInt(thing: unknown): thing is bigint {
  return typeof thing === 'bigint';
}

export function isFracSec(thing: unknown): thing is string {
  return isString(thing) && /^\d+\.\d+$/.test(thing);
}

export function isTs(thing: unknown): thing is Ts {
  return (
    isObject(thing) &&
    hasOwnProperty(thing, 'sec') &&
    isNumber(thing.sec) &&
    hasOwnProperty(thing, 'ns') &&
    isNumber(thing.ns)
  );
}
