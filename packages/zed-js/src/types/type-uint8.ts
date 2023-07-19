import { Uint8 } from '../values/uint8';
import { BasePrimitive } from './base-primitive';

export class TypeOfUint8 extends BasePrimitive<Uint8> {
  name = 'uint8';

  create(value: string | null) {
    return new Uint8(value);
  }
}

export const TypeUint8 = new TypeOfUint8();
