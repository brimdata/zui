import { EncodeStream } from '../encode-stream';
import { TypeAlias } from '../types/type-alias';
import { TypeRecord } from '../types/type-record';
import { ZedType } from '../types/types';
import { flatColumns } from '../utils/flat-columns';
import { trueType } from '../utils/true-type';
import { Field } from './field';
import { Null } from './null';
import { ZedValue, Value, JSOptions } from './types';

type ColumnName = string | string[];

export class Record implements Value {
  constructor(
    public type: TypeRecord | TypeAlias,
    public fields: Field[] | null
  ) {}

  get null() {
    return this.fields === null;
  }

  get flatColumns(): ColumnName[] {
    return flatColumns(this.trueType);
  }

  get columns() {
    if (this.fields === null) return [];
    return this.fields.map((f) => f.name);
  }

  get trueType(): TypeRecord {
    return trueType(this.type) as TypeRecord;
  }

  toString() {
    if (this.fields === null) return 'null';
    let s = '{';
    let sep = '';
    this.fields.forEach((f) => {
      // XXX need to check if name has funny chars
      s += sep + f.name + ':' + f.value.toString();
      sep = ',';
    });
    s += '}';
    return s;
  }

  serialize(stream: EncodeStream) {
    if (this.fields === null) return null;
    return this.fields.map((f) => stream.encodeValue(f.value));
  }

  at(index: number | number[]) {
    return this.fieldAt(index)?.value ?? null;
  }

  fieldAt(index: number | number[]): null | Field {
    if (this.fields === null) return null;
    if (typeof index === 'number') return this.fields[index];
    if (Array.isArray(index)) {
      if (index.length === 1) return this.fieldAt(index[0]);
      const [head, ...tail] = index;
      const value = this.fieldAt(head)?.value;
      if (!value) return null;
      if (!(value instanceof Record)) {
        throw new Error('Not a record');
      }
      return value.fieldAt(tail);
    } else {
      throw new Error('Argument must be number | number[]');
    }
  }

  has(name: string | string[], ...types: ZedType[]) {
    try {
      const type = this.get(name).type;
      return types.length === 0 ? true : types.some((t) => type === t);
    } catch (e) {
      return false;
    }
  }

  get<T extends ZedValue>(name: string | string[]): T {
    return (this.getField(name)?.value as T) ?? null;
  }

  getField(name: string | string[]): Field | null {
    if (typeof name === 'string') return this._getField(name);
    if (Array.isArray(name) && name.length === 0)
      throw new Error('No fields specified');
    if (name.length === 1) return this._getField(name[0]);

    const [next, ...rest] = name;
    const field = this.getField(next);
    if (!field) throw new Error('No field named ' + next);
    const value = field.baseValue;
    if (value == null || value instanceof Null) {
      return null;
    } else if (value instanceof Record) {
      return value.getField(rest);
    } else {
      throw new Error(`${next} is not a record`);
    }
  }

  try<T extends ZedValue>(name: string | string[]): T | null {
    try {
      return this.get(name) as T;
    } catch {
      return null;
    }
  }

  tryField(name: string | string[]) {
    try {
      return this.getField(name);
    } catch {
      return null;
    }
  }

  private _getField(name: string, parent?: Field): Field {
    if (!this.trueType.has(name)) {
      throw new UnknownColumnError(name, this.columns);
    }
    if (this.fields === null) {
      return new Field(name, new Null(), parent || this);
    } else {
      const ret = this.fields.find((f) => f.name == name);
      if (!ret) throw new Error("Couln't find field");
      return ret;
    }
  }

  isUnset() {
    return this.fields === null;
  }

  toJS(opts: JSOptions = {}) {
    if (this.fields === null) return null;
    return this.fields.reduce((obj, field) => {
      obj[field.name] = field.value.toJS(opts);
      return obj;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as { [key: string]: any });
  }
}

class UnknownColumnError extends Error {
  constructor(unknown: string, names: string[]) {
    const available = names.map((n) => `"${n}"`).join(', ');
    super(`"${unknown}" not present in [${available}]`);
  }
}
