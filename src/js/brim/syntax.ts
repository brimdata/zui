import {zed} from "zealot"
import {toZql} from "../zql/toZql"

export default {
  exclude(field: zed.Field) {
    return `${field.name}!=${toZql(field.data)}`
  },
  include(field: zed.Field) {
    return `${field.name}=${toZql(field.data)}`
  },
  in(field: zed.Field) {
    return `${toZql(field.data)} in ${field.name}`
  },
  notIn(field: zed.Field) {
    return `!${toZql(field.data)} in ${field.name}`
  },
  countBy(field: zed.Field) {
    return `count() by ${field.name}`
  },
  sortBy(name: string, direction: "asc" | "desc") {
    if (direction === "asc") return `sort ${name}`
    else {
      return `sort -r ${name}`
    }
  }
}
