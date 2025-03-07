import { Record } from './values/record';
import * as zjson from './zjson';
import { DecodeStream } from './decode-stream';
import { EncodeStream } from './encode-stream';
import { TypeAlias } from './types/type-alias';
import { TypeArray } from './types/type-array';
import { TypeError } from './types/type-error';
import { TypeMap } from './types/type-map';
import { TypeRecord } from './types/type-record';
import { TypeSet } from './types/type-set';
import { TypeUnion } from './types/type-union';
import { Type } from './types/types';
import { Field } from './values/field';
import { Value } from './values/types';
import { TypeField } from './types/type-field';

export type TypeDefs = { [key: string]: Type };

export class ZedContext {
  private typeByShape: TypeDefs = {};

  decode(objects: zjson.Obj[], stream = new DecodeStream(this)): Value[] {
    return objects.map((o) => this.decodeOne(o, stream));
  }

  decodeOne(
    object: zjson.Obj,
    stream: DecodeStream = new DecodeStream(this)
  ): Value {
    return stream.decode(object);
  }

  encode(values: Value[]) {
    const stream = new EncodeStream();
    return values.map((v) => this.encodeOne(v, stream));
  }

  encodeOne(
    value: Value,
    stream: EncodeStream = new EncodeStream()
  ): zjson.Obj {
    return stream.encode(value);
  }

  decodeField(obj: zjson.EncodedField) {
    // Grab the first field and return it
    const transport = this.decodeOne(obj.record) as Record;
    return transport.getField(obj.path);
  }

  encodeField(field: Field): zjson.EncodedField {
    // Wrap a field in a record to encode
    const root = field.rootRecord;
    if (!root) throw new Error('Unable to encode field, no root record');
    return {
      record: this.encodeOne(root),
      path: field.path,
    };
  }

  lookupErrorType(type: Type): TypeError {
    const key = TypeError.stringify(type);
    if (key in this.typeByShape) {
      return this.typeByShape[key] as TypeError;
    } else {
      return this.alloc(key, new TypeError(type));
    }
  }

  lookupTypeRecord(fields: TypeField[] | null): TypeRecord {
    const key = TypeRecord.stringify(fields);
    if (key in this.typeByShape) {
      const record = this.typeByShape[key] as TypeRecord;
      record.fields = fields;
      return record;
    } else {
      return this.alloc(key, new TypeRecord(fields));
    }
  }

  lookupTypeArray(type: Type): TypeArray {
    const key = TypeArray.stringify(type);
    if (key in this.typeByShape) {
      return this.typeByShape[key] as TypeArray;
    } else {
      return this.alloc(key, new TypeArray(type));
    }
  }

  lookupTypeSet(type: Type): TypeSet {
    const key = TypeSet.stringify(type);
    if (key in this.typeByShape) {
      return this.typeByShape[key] as TypeSet;
    } else {
      return this.alloc(key, new TypeSet(type));
    }
  }

  lookupTypeUnion(types: Type[]) {
    const key = TypeUnion.stringify(types);
    if (key in this.typeByShape) {
      return this.typeByShape[key];
    } else {
      return this.alloc(key, new TypeUnion(types));
    }
  }

  lookupTypeMap(keyType: Type, valType: Type) {
    const key = TypeMap.stringify(keyType, valType);
    if (key in this.typeByShape) {
      return this.typeByShape[key];
    } else {
      return this.alloc(key, new TypeMap(keyType, valType));
    }
  }

  lookupTypeAlias(name: string, type: Type) {
    const key = TypeAlias.stringify(name, type);
    if (key in this.typeByShape) {
      return this.typeByShape[key];
    } else {
      return this.alloc(key, new TypeAlias(name, type));
    }
  }

  alloc<T extends Type>(key: string, type: T): T {
    this.typeByShape[key] = type;
    return type;
  }
}

export const DefaultContext = new ZedContext();
