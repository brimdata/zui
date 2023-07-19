import { TypeUint16 } from '../types/type-uint16';
import { isNull } from '../utils/is-null';
import { Primitive } from './primitive';

export class Uint16 extends Primitive {
  type: typeof TypeUint16 = TypeUint16;

  toInt() {
    if (isNull(this.value)) return null;
    return parseInt(this.value);
  }

  toJS() {
    return this.toInt();
  }
}
