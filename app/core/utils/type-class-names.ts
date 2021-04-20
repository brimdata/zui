import {ZedData, ZedPrimitive} from "zealot/zed"

export function typeClassNames(data: ZedData) {
  const classNames = []
  if (data instanceof ZedPrimitive) {
    classNames.push(data.type)
  }
  if (data.typeName) classNames.push(data.typeName)
  if (data.isUnset()) classNames.push("null")
  return classNames.join(" ")
}
