import { TypeBString } from '../types/type-bstring';
import { Primitive } from './primitive';

export class BString extends Primitive {
  type: typeof TypeBString = TypeBString;

  toJS() {
    return this.toString();
  }
}
