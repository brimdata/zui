import * as zed from "@brimdata/zed-js"
import zedScript from "../zed-script"
import {toFieldPath} from "../zed-script/toZedScript"

export default {
  exclude(field: zed.Field) {
    return zedScript`${field}!=${field.value}`
  },
  include(field: zed.Field) {
    return zedScript`${field}==${field.value}`
  },
  in(field: zed.Field, value: zed.Value) {
    return zedScript`${value} in ${field}`
  },
  notIn(field: zed.Field, value: zed.Any) {
    return zedScript`!${value} in ${field}`
  },
  countBy(name: string | string[]) {
    return `count() by ${toFieldPath(name)}`
  },
  sortBy(name: string | string[], direction: "asc" | "desc") {
    if (direction === "asc") return `sort ${toFieldPath(name)}`
    else {
      return `sort -r ${toFieldPath(name)}`
    }
  },
}
