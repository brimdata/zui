import { isNull } from '../utils/is-null';
import { TypeFloat64 } from '../types/type-float64';
import { Primitive } from './primitive';

export class Float64 extends Primitive {
  type: typeof TypeFloat64 = TypeFloat64;

  toFloat() {
    if (isNull(this.value)) return null;
    return parseFloat(this.value);
  }

  toJS() {
    return this.toFloat();
  }
}
