import { TypeIp } from '../types/type-ip';
import { Primitive } from './primitive';

export class Ip extends Primitive {
  type: typeof TypeIp = TypeIp;

  toJS() {
    return this.toString();
  }
}
