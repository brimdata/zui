import { isString } from "../util/utils.ts";
import { Payload, FlatRecord, Field, ZngTypeDef } from "../types.ts";


interface TmpField {
  name: string;
  value: string | TmpField[];
  type: string;
}

function zip(values: string | string[] , columns: any): TmpField[] {
  if (typeof values === "string") return []
  else return values.map((value, index) => {
    let { name, type } = columns[index];
    return isString(type)
      ? { name, type, value }
      : { name, type: "record", value: zip(value, type) };
  });
}

function flattenFields({ name, value, type }: Field, prefix: string = ""): Field[] {
  return type === "record"
  // @ts-ignore
  ? flattenRecord(value, `${name}.`)
  : [{ name: prefix + name, type, value }];
}

function flattenRecord(record: FlatRecord, prefix: string = "") {
  return record.reduce(
    // @ts-ignore
    (array, field) => array.concat(flattenFields(field, prefix)),
    [],
  );
}

export function flatRecords() {
  const types: {[id: number]: ZngTypeDef} = {};

  return (payload: Payload) => {
    if (payload.type === "SearchRecords") {
      const records = payload.records.map((r) => {
        if (r.type) types[r.id] = r.type;
        // @ts-ignore
        return flattenRecord(zip(r.values, types[r.id]), "");
      });
      return {
        ...payload,
        records,
        types,
      };
    }

    return payload;
  };
}
