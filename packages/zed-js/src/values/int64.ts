import { isNull } from '../utils/is-null';
import { TypeInt64 } from '../types/type-int64';
import { Primitive } from './primitive';
import { JSOptions } from './types';

export class Int64 extends Primitive {
  type: typeof TypeInt64 = TypeInt64;

  toInt() {
    if (isNull(this.value)) return null;
    return parseInt(this.value);
  }

  toBigInt() {
    if (isNull(this.value)) return null;
    return BigInt(this.value);
  }

  toJS(opts: JSOptions = {}) {
    if (opts.bigint) {
      return this.toBigInt();
    } else {
      return this.toInt();
    }
  }
}
