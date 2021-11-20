import {zed} from "zealot"

export function zedTypeClassName(data: zed.AnyValue) {
  if (data instanceof zed.Primitive) {
    return `zed-${data.type.name}`
  } else if (data.isUnset()) {
    return "zed-null"
  }
}
