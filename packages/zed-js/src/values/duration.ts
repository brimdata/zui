import { TypeDuration } from '../types/type-duration';
import { isNull } from '../utils/is-null';
import { Primitive } from './primitive';

export class Duration extends Primitive {
  type: typeof TypeDuration = TypeDuration;
  _nanos: bigint | null;

  constructor(value: string | null) {
    super(value);
    if (isNull(value)) {
      this._nanos = null;
    } else {
      this._nanos = parseNanos(value);
    }
  }

  asSeconds() {
    if (isNull(this._nanos)) return null;
    const millis = Number(this._nanos / BigInt(1e6));
    return millis / 1000;
  }

  asMs() {
    if (isNull(this._nanos)) return null;
    return Number(this._nanos / BigInt(1e6));
  }

  asNanos() {
    return this._nanos;
  }

  toJS() {
    return this.asMs();
  }
}

const parseRE = /([.0-9]+)(ns|us|ms|s|m|h|d|w|y)/g;

export const Nanosecond = BigInt(1);
export const Microsecond = BigInt(1000) * Nanosecond;
export const Millisecond = BigInt(1000) * Microsecond;
export const Second = BigInt(1000) * Millisecond;
export const Minute = BigInt(60) * Second;
export const Hour = BigInt(60) * Minute;
export const Day = BigInt(24) * Hour;
export const Week = BigInt(7) * Day;
export const Year = BigInt(365) * Day;
const scale = {
  ns: Nanosecond,
  us: Microsecond,
  ms: Millisecond,
  s: Second,
  m: Minute,
  h: Hour,
  d: Day,
  w: Week,
  y: Year,
};
type UnitName = keyof typeof scale;

function parseNanos(s: string) {
  if (s.length === 0) return BigInt(0);

  let negative = false;
  if (s[0] === '-') {
    negative = true;
    s = s.slice(1);
  }
  const matches = s.matchAll(parseRE);
  let d = BigInt(0);
  for (const match of matches) {
    if (match.length !== 3) throw new Error('Invalid Duration');
    const [_all, num, unitName] = match;
    let unit = scale[unitName as UnitName];
    if (num.includes('.')) {
      const parts = num.split('.');
      if (parts.length !== 2) throw new Error('Invalid Duration');
      const whole = parts[0];
      d += BigInt(whole) * unit;
      const frac = parts[1];
      let extra = BigInt(0);
      for (const char of frac) {
        extra += BigInt(char) * unit;
        unit /= BigInt(10);
      }
      d += (extra + BigInt(5)) / BigInt(10);
    } else {
      d += BigInt(num) * unit;
    }
  }
  if (negative) {
    d *= BigInt(-1);
  }
  return d;
}
