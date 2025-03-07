import { Float64 } from '../values/float64';
import { BasePrimitive } from './base-primitive';

export class TypeOfFloat64 extends BasePrimitive<Float64> {
  name = 'float64';

  create(value: string | null) {
    return new Float64(value);
  }
}

export const TypeFloat64 = new TypeOfFloat64();
