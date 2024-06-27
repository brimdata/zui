import * as zjson from '../zjson';
import { DecodeStream } from '../decode-stream';
import { TypeValue } from '../values/type-value';
import { BasePrimitive } from './base-primitive';

export class TypeOfType extends BasePrimitive<TypeValue> {
  name = 'type';

  create(value: zjson.Type | null, stream: DecodeStream): TypeValue {
    return new TypeValue(value === null ? null : stream.decodeType(value));
  }
}

export const TypeType = new TypeOfType();
