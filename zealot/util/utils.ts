import { Ts } from "../types.ts";

function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export function url(host: string, path: string) {
  return `http://${host}${path}`;
}

export function isObject(thing: unknown): thing is {} {
  return typeof thing === "object" && thing !== null;
}

export function isString(thing: unknown): thing is string {
  return typeof thing === "string";
}

export function isDate(thing: unknown): thing is Date {
  return isObject(thing) && thing.constructor.name === "Date";
}

export function isNumber(thing: unknown) {
  return typeof thing === "number";
}

export function isBigInt(thing: unknown): thing is bigint {
  return typeof thing === "bigint";
}

export function isFracSec(thing: unknown): thing is string {
  return isString(thing) && /^\d+\.\d+$/.test(thing);
}

export function isTs(thing: unknown): thing is Ts {
  return isObject(thing) && hasOwnProperty(thing, "sec") &&
    isNumber(thing.sec) && hasOwnProperty(thing, "ns") && isNumber(thing.ns);
}

export function uniq(array: any[]) {
  const u: any[] = [];
  for (const item of array) {
    if (!u.includes(item)) {
      u.push(item);
    }
  }
  return u;
}
