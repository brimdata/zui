import {$Field} from "./"

export default {
  exclude(field: $Field) {
    return `${field.name}!=${field.queryableValue()}`
  },
  include(field: $Field) {
    return `${field.name}=${field.queryableValue()}`
  },
  in(field: $Field) {
    return `${field.queryableValue()} in ${field.name}`
  },
  notIn(field: $Field) {
    return `!${field.queryableValue()} in ${field.name}`
  },
  countBy(field: $Field) {
    return `count() by ${field.name}`
  },
  sortBy(name: string, direction: "asc" | "desc") {
    if (direction === "asc") return `sort ${name}`
    else {
      return `sort -r ${name}`
    }
  }
}
