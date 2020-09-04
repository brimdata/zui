
import { RecordData } from "../../types/records";
import { ReturnType } from "../../types";

export type $Channel = ReturnType<typeof channel>;

export default function channel(id: number) {
  let records: RecordData[] = [];

  return {
    add(more: RecordData[]) {
      records = records.concat(more);
    },
    id() {
      return id;
    },
    records() {
      return records;
    },
    empty() {
      return records.length === 0;
    },
    clear() {
      records = [];
    }
  };
}