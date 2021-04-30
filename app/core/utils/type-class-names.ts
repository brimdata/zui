import {zed} from "zealot"

export function typeClassNames(data: zed.AnyValue) {
  const classNames = []
  if (data instanceof zed.Primitive) {
    classNames.push(data.type.name)
  }
  if (data.isUnset()) classNames.push("null")
  return classNames.join(" ")
}
