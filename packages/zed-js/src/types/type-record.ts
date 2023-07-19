import * as zjson from '../zjson';
import { DecodeStream } from '../decode-stream';
import { EncodeStream } from '../encode-stream';
import { isNull } from '../utils/is-null';
import { trueType } from '../utils/true-type';
import { Field } from '../values/field';
import { Null } from '../values/null';
import { Record } from '../values/record';
import { TypeField } from './type-field';
import { Type } from './types';

export type FieldData = { name: string; type: Type };
export class TypeRecord implements Type {
  kind = 'record';

  constructor(public fields: TypeField[] | null) {}

  has(name: string) {
    return !!this.fields?.find((f) => f.name === name);
  }

  static stringify(fields: FieldData[] | null) {
    if (isNull(fields)) return 'null';
    let s = '{';
    let sep = '';
    fields.forEach((f) => {
      s += sep + f.name + ':' + f.type.toString();
      sep = ',';
    });
    s += '}';
    return s;
  }

  toString() {
    if (isNull(this.fields)) return 'null';
    let s = '{';
    let sep = '';
    this.fields.forEach((f) => {
      s += sep + f.name + ':' + f.type.toString();
      sep = ',';
    });
    s += '}';
    return s;
  }

  create(
    values: zjson.RecordValue | null,
    stream: DecodeStream,
    parent?: Field
  ) {
    if (values === null || isNull(this.fields)) return new Record(this, null);
    const record = new Record(this, null /* temp */);
    // If a parent was passed in, then we are constructing a nested record
    // and the parent is a Field. If no parent, then we are creating the
    // root record and the parent is this record.
    const progenitor = parent || record; // just needed another variable name for parent

    record.fields = this.fields.map((f, i) => {
      if (trueType(f.type) instanceof TypeRecord) {
        const field = new Field(f.name, new Null() /* temp */, progenitor);
        field.value = f.type.create(values[i], stream, field);
        return field;
      } else {
        return new Field(f.name, f.type.create(values[i], stream), progenitor);
      }
    });
    return record;
  }

  serialize(stream: EncodeStream): zjson.NoId<zjson.RecordType> {
    return {
      kind: 'record',
      fields: isNull(this.fields)
        ? null
        : this.fields.map((f) => {
            return {
              name: f.name,
              type: stream.encodeType(f.type),
            } as zjson.FieldType;
          }),
    };
  }
}
