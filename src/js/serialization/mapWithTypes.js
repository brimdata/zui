/* @flow */
import {whatIs} from "../lib/is"

export function mapWithTypes(value: *, types: *, transform: Function): Object {
  const type = whatIs(value)
  switch (type) {
    case "Object":
      var newObj = {}
      for (var key in value) {
        if (value.hasOwnProperty(key))
          newObj[key] = mapWithTypes(value[key], types[key], transform)
      }
      return newObj
    case "Array":
      return value.map((v, i) => mapWithTypes(v, types[i], transform))
    default:
      return transform(value, types)
  }
}
