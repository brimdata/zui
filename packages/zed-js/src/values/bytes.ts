import { TypeBytes } from '../types/type-bytes';
import { Primitive } from './primitive';

export class Bytes extends Primitive {
  type: typeof TypeBytes = TypeBytes;

  toJS() {
    return this.toString();
  }
}
