import * as jsup from '../jsup';
import { DecodeStream } from '../decode-stream';
import { TypeValue } from '../values/type-value';
import { BasePrimitive } from './base-primitive';

export class TypeOfType extends BasePrimitive<TypeValue> {
  name = 'type';

  create(value: jsup.Type | null, stream: DecodeStream): TypeValue {
    return new TypeValue(value === null ? null : stream.decodeType(value));
  }
}

export const TypeType = new TypeOfType();
