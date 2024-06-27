import { Ip } from '../values/ip';
import { BasePrimitive } from './base-primitive';

export class TypeOfIp extends BasePrimitive<Ip> {
  name = 'ip';

  create(value: string) {
    return new Ip(value);
  }
}

export const TypeIp = new TypeOfIp();
