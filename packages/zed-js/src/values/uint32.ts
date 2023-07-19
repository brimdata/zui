import { TypeUint32 } from '../types/type-uint32';
import { isNull } from '../utils/is-null';
import { Primitive } from './primitive';

export class Uint32 extends Primitive {
  type: typeof TypeUint32 = TypeUint32;

  toInt() {
    if (isNull(this.value)) return null;
    return parseInt(this.value);
  }

  toJS() {
    return this.toInt();
  }
}
