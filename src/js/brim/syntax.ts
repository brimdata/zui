import {ZedField} from "zealot/zed"
import {toZql} from "../zql/toZql"

export default {
  exclude(field: ZedField) {
    return `${field.name}!=${toZql(field.data)}`
  },
  include(field: ZedField) {
    return `${field.name}=${toZql(field.data)}`
  },
  in(field: ZedField) {
    return `${toZql(field.data)} in ${field.name}`
  },
  notIn(field: ZedField) {
    return `!${toZql(field.data)} in ${field.name}`
  },
  countBy(field: ZedField) {
    return `count() by ${field.name}`
  },
  sortBy(name: string, direction: "asc" | "desc") {
    if (direction === "asc") return `sort ${name}`
    else {
      return `sort -r ${name}`
    }
  }
}
