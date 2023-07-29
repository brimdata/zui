import { String } from '../values/string';
import { BasePrimitive } from './base-primitive';
export class TypeOfString extends BasePrimitive<String> {
  name = 'string';

  create(value: string) {
    return new String(value);
  }
}

export const TypeString = new TypeOfString();
