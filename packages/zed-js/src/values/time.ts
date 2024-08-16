import { toZonedTime } from 'date-fns-tz';
import { TypeTime } from '../types/type-time';
import { Primitive } from './primitive';
import { format } from 'date-fns';

export class Time extends Primitive {
  static zone = null;
  static format = null;

  type: typeof TypeTime = TypeTime;

  constructor(value: string) {
    super(value);
  }

  toZonedDate() {
    if (!this.value) return null;
    return toZonedTime(this.value, this.zone);
  }

  toDate() {
    if (!this.value) return null;
    return new Date(this.value);
  }

  toJS() {
    return this.toDate();
  }

  override toString(): string {
    if (!this.value) return 'null';
    return format(this.toZonedDate()!, this.format);
  }

  get zone() {
    return Time.zone || 'UTC';
  }

  get format() {
    return Time.format || "yyyy-MM-dd'T'HH:mm:ss.SSS";
  }
}
