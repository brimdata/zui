import { TypeTime } from '../types/type-time';
import { isNull } from '../utils/is-null';
import { Primitive } from './primitive';

export class Time extends Primitive {
  type: typeof TypeTime = TypeTime;
  _date: Date | null;

  constructor(value: string) {
    super(value);
    this._date = isNull(value) ? null : new Date(value);
  }

  toDate() {
    return this._date;
  }

  toJS() {
    return this.toDate();
  }
}
