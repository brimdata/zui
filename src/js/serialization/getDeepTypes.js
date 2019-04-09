/* @flow */

import {whatIs} from "../lib/is"

export function getDeepTypes(obj: any, getType: Function) {
  let func = getType || whatIs
  let type = func(obj)
  switch (type) {
    case "Object":
      var map = {}
      for (var key in obj) map[key] = getDeepTypes(obj[key], func)
      return map
    case "Array":
      return obj.map((v) => getDeepTypes(v, func))
    default:
      return type
  }
}
