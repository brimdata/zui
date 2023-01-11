import {zed} from "@brimdata/zealot"
import zql from "../zql"
import {toFieldPath} from "../zql/toZql"

export default {
  exclude(field: zed.Field) {
    return zql`${field}!=${field.value}`
  },
  include(field: zed.Field) {
    return zql`${field}==${field.value}`
  },
  in(field: zed.Field, value: zed.Value) {
    return zql`${value} in ${field}`
  },
  notIn(field: zed.Field, value: zed.Any) {
    return zql`!${value} in ${field}`
  },
  countBy(field: zed.Field | zed.TypeField) {
    return zql`count() by ${field}`
  },
  sortBy(name: string | string[], direction: "asc" | "desc") {
    if (direction === "asc") return `sort ${toFieldPath(name)}`
    else {
      return `sort -r ${toFieldPath(name)}`
    }
  },
}
