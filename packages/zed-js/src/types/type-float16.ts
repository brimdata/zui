import { Float16 } from '../values/float16';
import { BasePrimitive } from './base-primitive';

export class TypeOfFloat16 extends BasePrimitive<Float16> {
  name = 'float16';

  create(value: string | null) {
    return new Float16(value);
  }
}

export const TypeFloat16 = new TypeOfFloat16();
