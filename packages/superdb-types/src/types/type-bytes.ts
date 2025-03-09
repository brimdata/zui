import { Bytes } from '../values/bytes';
import { BasePrimitive } from './base-primitive';

export class TypeOfBytes extends BasePrimitive<Bytes> {
  name = 'bytes';

  create(value: string) {
    return new Bytes(value);
  }
}

export const TypeBytes = new TypeOfBytes();
