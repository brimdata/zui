import {zed} from "zealot"
import {toZql} from "../zql/toZql"

export default {
  exclude(field: zed.Field) {
    return `${toZql(field)}!=${toZql(field.value)}`
  },
  include(field: zed.Field) {
    return `${toZql(field)}==${toZql(field.value)}`
  },
  in(field: zed.Field) {
    return `${toZql(field)} in ${toZql(field.name)}"`
  },
  notIn(field: zed.Field) {
    return `!${toZql(field)} in "${toZql(field.name)}"`
  },
  countBy(field: zed.Field) {
    return `count() by "${toZql(field)}"`
  },
  sortBy(name: string, direction: "asc" | "desc") {
    if (direction === "asc") return `sort ${name}`
    else {
      return `sort -r ${name}`
    }
  }
}
