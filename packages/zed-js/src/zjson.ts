type ID = string;

export type NoId<T extends object> = Omit<T, 'id'>;

export type FieldType = {
  name: string;
  type: Type;
};

export type PrimitiveType = {
  kind: 'primitive';
  name: string;
};

export type RecordType = {
  id: number;
  kind: 'record';
  fields: FieldType[] | null;
};

export type ArrayType = {
  id: number;
  kind: 'array';
  type: Type;
};

export type SetType = {
  id: number;
  kind: 'set';
  type: Type;
};

export type UnionType = {
  id: number;
  kind: 'union';
  types: Type[];
};

export type EnumType = {
  kind: 'enum';
  symbols: string[];
};

export type MapType = {
  kind: 'map';
  key_type: Type;
  val_type: Type;
};

export type TypeDefType = {
  kind: 'typedef';
  name: ID;
  type: Type;
};

export type NamedType = {
  kind: 'named';
  name: string;
  id: number;
  type: Type;
};

export type ErrorType = {
  id: number;
  kind: 'error';
  type: Type;
};

export type RefType = {
  kind: 'ref';
  id: number;
};

export type Type =
  | PrimitiveType
  | RecordType
  | ArrayType
  | SetType
  | UnionType
  | EnumType
  | MapType
  | RefType
  | NamedType
  | ErrorType;

export type Value = string | null | Type | NoId<Type> | Value[];
export type ArrayValue = Value[] | null;
export type SetValue = Value[] | null;
export type UnionValue = [string, Value];
export type RecordValue = Value[];

export type Obj = {
  type: Type;
  value: Value;
};

export type EncodedField = {
  record: Obj;
  path: string | string[];
};

export type QueryChannelSet = {
  type: 'QueryChannelSet';
  value: { channel_id: number };
};

export type QueryChannelEnd = {
  type: 'QueryChannelEnd';
  value: { channel_id: number };
};

export type QueryStats = {
  type: 'QueryStats';
  value: {
    start_time: { sec: number; ns: number };
    update_time: { sec: number; ns: number };
    bytes_read: number;
    bytes_matched: number;
    records_read: number;
    recods_matched: number;
  };
};

export type QueryError = {
  type: 'QueryError';
  value: {
    error: string;
  };
};

export type QueryObject =
  | QueryError
  | QueryChannelSet
  | QueryChannelEnd
  | QueryStats
  | Obj;
