import { TypeNet } from '../types/type-net';
import { Primitive } from './primitive';

export class Net extends Primitive {
  type: typeof TypeNet = TypeNet;

  toJS() {
    return this.toString();
  }
}
