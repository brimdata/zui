import {zed} from "@brimdata/zealot"

export function zedTypeClassName(data: zed.Value | zed.Type) {
  if (zed.isType(data)) {
    return "zed-type"
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
