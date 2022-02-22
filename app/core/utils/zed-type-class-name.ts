import {zed} from "@brimdata/zealot"

export function zedTypeClassName(data: zed.Value | zed.Type) {
  if (zed.isType(data)) {
    return "zed-type"
  }

  if (data.isUnset()) {
    return "zed-null"
  }

  if (data instanceof zed.Error) {
    return "zed-error"
  }

  if (data instanceof zed.Primitive) {
    const concrete = zed.trueType(data.type)
    const classes = []
    if (concrete !== data.type && concrete instanceof zed.TypeAlias) {
      classes.push(`zed-${concrete.name}`)
    } else if (zed.isPrimitiveType(data.type)) {
      classes.push(`zed-${data.type.name}`)
    }
    return classes.join(" ")
  }
}
