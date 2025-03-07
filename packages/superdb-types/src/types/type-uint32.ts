import { Uint32 } from '../values/uint32';
import { BasePrimitive } from './base-primitive';

export class TypeOfUint32 extends BasePrimitive<Uint32> {
  name = 'uint32';

  create(value: string | null) {
    return new Uint32(value);
  }
}

export const TypeUint32 = new TypeOfUint32();
