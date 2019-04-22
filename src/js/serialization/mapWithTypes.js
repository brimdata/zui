/* @flow */
import {whatIs} from "../lib/is"

export function mapWithTypes(value: *, types: *, transform: Function): Object {
  const type = whatIs(types)
  switch (type) {
    case "Object":
      var newObj = {}
      for (var key in value) {
        if (value.hasOwnProperty(key))
          newObj[key] = mapWithTypes(value[key], types[key], transform)
      }
      return newObj
    case "Array":
      return types.map((t, i) => mapWithTypes(value[i], t, transform))
    default:
      return transform(value, types)
  }
}
