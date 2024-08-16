import { toZonedTime } from 'date-fns-tz';
import { TypeTime } from '../types/type-time';
import { Primitive } from './primitive';
import { format } from 'date-fns';

export class Time extends Primitive {
  static zone = 'UTC';
  static format = "yyyy-MM-dd'T'HH:mm:ss.SSS";

  type: typeof TypeTime = TypeTime;

  constructor(value: string) {
    super(value);
  }

  toZonedDate() {
    if (!this.value) return null;
    return toZonedTime(this.value, Time.zone);
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
    return format(this.toZonedDate()!, Time.format);
  }
}
