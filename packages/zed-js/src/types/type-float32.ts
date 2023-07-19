import { Float32 } from '../values/float32';
import { BasePrimitive } from './base-primitive';

export class TypeOfFloat32 extends BasePrimitive<Float32> {
  name = 'float32';

  create(value: string | null) {
    return new Float32(value);
  }
}

export const TypeFloat32 = new TypeOfFloat32();
