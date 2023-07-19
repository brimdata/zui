import { isNull } from '../utils/is-null';
import { TypeInt32 } from '../types/type-int32';
import { Primitive } from './primitive';

export class Int32 extends Primitive {
  type: typeof TypeInt32 = TypeInt32;

  toInt() {
    if (isNull(this.value)) return null;
    return parseInt(this.value);
  }

  toJS() {
    return this.toInt();
  }
}
