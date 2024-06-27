import { isNull } from '../utils/is-null';
import { TypeUint64 } from '../types/type-uint64';
import { Primitive } from './primitive';
import { JSOptions } from './types';

export class Uint64 extends Primitive {
  type: typeof TypeUint64 = TypeUint64;

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
