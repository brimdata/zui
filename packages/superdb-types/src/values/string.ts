import { TypeString } from '../types/type-string';
import { Primitive } from './primitive';

export class String extends Primitive {
  type: typeof TypeString = TypeString;

  toJS() {
    return this.toString();
  }
}
