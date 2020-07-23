import { Payload } from "../types.ts";

export function totalRecords() {
  let total_records = 0;

  return (payload: Payload) => {
    if (payload.type === "TaskEnd") {
      return {
        ...payload,
        total_records,
      };
    } else if (payload.type === "SearchRecords") {
      total_records += payload.records.length;
    }
    return payload;
  };
}
