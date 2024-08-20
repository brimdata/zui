import { toZonedTime } from 'date-fns-tz';
import { TypeTime } from '../types/type-time';
import { Primitive } from './primitive';
import { JSOptions } from './types';
import strftime from 'strftime';

export class Time extends Primitive {
  type: typeof TypeTime = TypeTime;
  _zone?: string;

  static config: { zone?: string | null; format?: string | null } = {};

  constructor(value: string) {
    super(value);
  }

  toDate() {
    if (!this.value) return null;
    return new Date(this.value);
  }

  toJS(opts: JSOptions = {}) {
    if (opts.zonedDates) {
      return this.toZonedDate();
    } else {
      return this.toDate();
    }
  }

  toZonedDate() {
    if (!this.value) return null;
    return toZonedTime(this.value, this.zone);
  }

  format(specifier = this.formatSpecifier) {
    if (!this.value) return 'null';
    return strftime.timezone(this.offset)(specifier, this.toDate()!);
  }

  override toString() {
    if (!this.value) return 'null';
    if (Time.config.format || Time.config.zone || this.zone != 'UTC')
      return this.format();
    else return this.value;
  }

  get offset() {
    const timeZone = this.zone;
    const date = this.toDate();
    if (!date) return 0;
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return (tzDate.getTime() - utcDate.getTime()) / 6e4;
  }

  get zone() {
    return this._zone || Time.config.zone || 'UTC';
  }

  set zone(value: string) {
    this._zone = value;
  }

  get formatSpecifier() {
    return Time.config.format || '%Y-%m-%dT%H:%M:%S.%L%:z';
  }
}
