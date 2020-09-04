
import { Column } from "../types";
import { FieldValue, RecordData } from "../types/records";
import brim, { $Field } from "./";

export type $Record = {
  columns: () => Column[];
  values: () => FieldValue[];
  data: () => RecordData;
  get: (arg0: string) => $Field | null | undefined;
  mustGet: (arg0: string) => $Field;
};

export default function record(data: RecordData): $Record {
  return {
    columns() {
      return data.map<Column>(({
        name,
        type
      }) => ({ name, type }));
    },
    values() {
      return data.map<FieldValue>(({
        value
      }) => value);
    },
    data() {
      return data;
    },
    get(name: string) {
      let fieldData = data.find(field => field.name === name);
      return fieldData ? brim.field(fieldData) : null;
    },
    mustGet(name: string) {
      const f = this.get(name);
      if (f) return f;else throw new Error(`Missing field: ${name}`);
    }
  };
}