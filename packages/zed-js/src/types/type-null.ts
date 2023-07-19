import { Null } from '../values/null';
import { BasePrimitive } from './base-primitive';

export class TypeOfNull extends BasePrimitive<Null> {
  name = 'null';

  create(_value: unknown) {
    return new Null();
  }
}

export const TypeNull = new TypeOfNull();
