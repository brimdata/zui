import * as zed from "zealot/zed"

export function typeClassNames(data: zed.AnyValue) {
  const classNames = []
  if (data instanceof zed.Primitive) {
    classNames.push(data.type.toString())
  }
  if (data.isUnset()) classNames.push("null")
  return classNames.join(" ")
}
