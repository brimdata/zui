import { TypeUint8 } from '../types/type-uint8';
import { isNull } from '../utils/is-null';
import { Primitive } from './primitive';

export class Uint8 extends Primitive {
  type: typeof TypeUint8 = TypeUint8;

  toInt() {
    if (isNull(this.value)) return null;
    return parseInt(this.value);
  }

  toJS() {
    return this.toInt();
  }
}
