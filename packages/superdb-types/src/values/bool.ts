import { TypeBool } from '../types/type-bool';
import { Primitive } from './primitive';

export class Bool extends Primitive {
  type: typeof TypeBool = TypeBool;

  toJS() {
    if (this.value === null) return null;
    if (this.value === 'true') return true;
    return false;
  }
}
