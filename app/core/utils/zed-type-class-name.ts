import {zed} from "zealot"

export function zedTypeClassName(data: zed.AnyValue | zed.ZedTypeInterface) {
  if (zed.isType(data)) {
    if (zed.isPrimitiveType(data)) {
      return "zed-type"
    } else return
  }

  if (data.isUnset()) {
    return "zed-null"
  }

  if (data instanceof zed.Primitive) {
    const concrete = zed.trueType(data.type)
    if (concrete !== data.type && "name" in concrete) {
      return `zed-${data.type.name} zed-${concrete.name}`
    } else {
      return `zed-${data.type.name}`
    }
  }
}
