import {zed} from "@brimdata/zealot"

export function typeClassNames(data: zed.Value) {
  const classNames = []
  if (data instanceof zed.Primitive) {
    // @ts-ignore
    classNames.push(data.type.name)
  }
  if (data.isUnset()) classNames.push("null")
  return classNames.join(" ")
}
