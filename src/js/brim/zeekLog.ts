import {zng} from "zealot"
import {createCell} from "./cell"

export function createZeekLog(record: zng.Record) {
  return {
    correlationId() {
      let name
      switch (record.try("_path")?.toString()) {
        case "files":
          name = "conn_uids"
          break
        case "dhcp":
          name = "uids"
          break
        default:
          name = "uid"
          break
      }

      const field = record.tryField(name)
      return field ? createCell(field).queryableValue() : ""
    }
  }
}
