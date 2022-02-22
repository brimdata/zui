import {zed} from "@brimdata/zealot"

/**
    We need to know how many rows a given zed 
    value will take up in the inspector so that
    we can render a value in the right place,
    without needing to render all the preceding
    values.
 */
export function getRowCount(value: zed.Value | zed.Type, isExpanded) {
  if (zed.isType(value)) {
    if (value instanceof zed.TypeRecord) {
      if (!isExpanded(value)) return 1
      return value.fields.reduce((sum, field) => {
        return sum + getRowCount(field.type, isExpanded)
      }, 2)
    }
    if (value instanceof zed.TypeUnion) {
      if (!isExpanded(value)) return 1
      return value.types.reduce((sum, type) => {
        return sum + getRowCount(type, isExpanded)
      }, 2)
    }
    if (value instanceof zed.TypeError) {
      if (!isExpanded(value)) return 1
      return getRowCount(value.type, isExpanded) + 2
    }
    return 1
  } else {
    if (value.isUnset()) return 1
    if (zed.isPrimitive(value)) return 1

    if (value instanceof zed.Record) {
      if (!isExpanded(value)) return 1
      return value.fields.reduce((sum, field) => {
        return sum + getRowCount(field.data, isExpanded)
      }, 2) // The two is for the open and closing brackets
    }
    if (value instanceof zed.Array) {
      if (!isExpanded(value)) return 1
      return value.items.reduce((sum, item) => {
        return sum + getRowCount(item, isExpanded)
      }, 2)
    }
    if (value instanceof zed.Set) {
      if (!isExpanded(value)) return 1
      return value.items.reduce((sum, item) => {
        return sum + getRowCount(item, isExpanded)
      }, 2)
    }
    if (value instanceof zed.Map) {
      if (!isExpanded(value)) return 1
      return Array.from(value.value.values()).reduce((sum, value) => {
        return sum + getRowCount(value, isExpanded)
      }, 2)
    }
    if (value instanceof zed.Union) {
      return getRowCount(value.value, isExpanded)
    }
    if (value instanceof zed.TypeValue) {
      return getRowCount(value.value, isExpanded)
    }
    if (value instanceof zed.Error) {
      if (!isExpanded(value)) return 1
      return getRowCount(value.value, isExpanded) + 2
    }
    return 1
  }
}
