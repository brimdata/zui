import * as jsup from './jsup';
import { Type } from './types/types';
import { Value } from './values/types';
import { TypeValue } from './values/type-value';
import { isPrimitiveType } from './types/type-primitives';

export class EncodeStream {
  private id = 30;
  private map = new Map<Type, number>();

  encode(value: Value): jsup.Obj {
    return {
      type: this.encodeType(value.type) as jsup.Type,
      value: this.encodeValue(value),
    };
  }

  encodeType(type: Type): jsup.Type {
    if (isPrimitiveType(type)) {
      return type.serialize() as jsup.PrimitiveType;
    } else if (this.hasSeen(type)) {
      return { kind: 'ref', id: this.getId(type) } as jsup.RefType;
    } else {
      const jsup = type.serialize(this);
      const id = this.id++;
      this.map.set(type, id);
      return { id, ...jsup } as jsup.Type;
    }
  }

  encodeValue(value: Value | null): jsup.Value {
    if (!value) return null;
    if (value instanceof TypeValue) {
      if (value.value === null) return null;
      return this.encodeType(value.value);
    } else {
      return value.serialize(this);
    }
  }

  private hasSeen(type: Type) {
    return this.map.has(type);
  }

  private getId(type: Type) {
    return this.map.get(type);
  }
}
