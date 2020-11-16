import {Cell} from "./cell"

export default {
  exclude(field: Cell) {
    return `${field.name}!=${field.queryableValue()}`
  },
  include(field: Cell) {
    return `${field.name}=${field.queryableValue()}`
  },
  in(field: Cell) {
    return `${field.queryableValue()} in ${field.name}`
  },
  notIn(field: Cell) {
    return `!${field.queryableValue()} in ${field.name}`
  },
  countBy(field: Cell) {
    return `count() by ${field.name}`
  },
  sortBy(name: string, direction: "asc" | "desc") {
    if (direction === "asc") return `sort ${name}`
    else {
      return `sort -r ${name}`
    }
  }
}
