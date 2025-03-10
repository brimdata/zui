import { isNull } from '../utils/is-null';
import { TypeFloat32 } from '../types/type-float32';
import { Primitive } from './primitive';

export class Float32 extends Primitive {
  type: typeof TypeFloat32 = TypeFloat32;

  toFloat() {
    if (isNull(this.value)) return null;
    return parseFloat(this.value);
  }

  toJS() {
    return this.toFloat();
  }
}
