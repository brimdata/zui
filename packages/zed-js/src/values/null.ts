import { TypeNull } from '../types/type-null';
import { Primitive } from './primitive';

export class Null extends Primitive {
  type: typeof TypeNull = TypeNull;
  override value = null;

  toJS() {
    return null;
  }
}
