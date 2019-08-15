/* @flow */
import type {$Field} from "./"

export default {
  exclude(field: $Field) {
    return `${field.name}!=${field.queryableValue()}`
  },
  include(field: $Field) {
    return `${field.name}=${field.queryableValue()}`
  },
  countBy(field: $Field) {
    return `count() by ${field.name}`
  }
}
