import { Int32 } from '../values/int32';
import { BasePrimitive } from './base-primitive';

export class TypeOfInt32 extends BasePrimitive<Int32> {
  name = 'int32';

  create(value: string | null) {
    return new Int32(value);
  }
}

export const TypeInt32 = new TypeOfInt32();
