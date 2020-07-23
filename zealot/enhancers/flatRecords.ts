import { isString } from "../util/utils.ts";
import { Payload, FlatRecord, Field, ZngTypeDef, FlatType } from "../types.ts";

interface TmpField {
  name: string;
  value: string | TmpField[];
  type: string;
}

function zip(values: string | string[], columns: any): TmpField[] {
  if (typeof values === "string") return [];
  else {
    return values.map((value, index) => {
      let { name, type } = columns[index];
      return isString(type)
        ? { name, type, value }
        : { name, type: "record", value: zip(value, type) };
    });
  }
}

function flattenFields(
  { name, value, type }: Field,
  prefix: string = "",
): Field[] {
  return type === "record"
    ? // @ts-ignore
      flattenRecord(value, `${name}.`)
    : [{ name: prefix + name, type, value }];
}

function flattenRecord(record: FlatRecord, prefix: string = "") {
  return record.reduce(
    // @ts-ignore
    (array, field) => array.concat(flattenFields(field, prefix)),
    [],
  );
}

type Column = { name: string; type: string };

function flattenType(descriptor: ZngTypeDef, prefix: string = ""): Column[] {
  return descriptor.reduce<Column[]>((flat, { name, type }) => {
    const cols = Array.isArray(type)
      ? flattenType(type, `${prefix}${name}.`)
      : [{ name: prefix + name, type }];

    return flat.concat(cols);
  }, []);
}

export function flatRecords() {
  const flat_types: { [id: number]: FlatType[] } = {};
  const types: { [id: number]: ZngTypeDef } = {};

  return (payload: Payload): Payload => {
    if (payload.type === "SearchRecords") {
      const flat_records = payload.records.map((r) => {
        if (r.type) {
          types[r.id] = r.type;
          flat_types[r.id] = flattenType(r.type);
        }
        // @ts-ignore
        return flattenRecord(zip(r.values, types[r.id]), "");
      });
      return {
        ...payload,
        flat_records,
        flat_types,
      };
    }

    return payload;
  };
}
