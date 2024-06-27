import { Typename } from '../values/typename';
import { BasePrimitive } from './base-primitive';

export class TypeOfTypename extends BasePrimitive<Typename> {
  name = 'typename';

  create(value: string) {
    return new Typename(value);
  }
}

export const TypeTypename = new TypeOfTypename();
