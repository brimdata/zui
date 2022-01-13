import containers, {ContainerName, ContainerType} from "./types/type-containers"
import primitives, {PrimitiveName, PrimitiveType} from "./types/type-primitives"
import {Type} from "./types/types"

export function isType(value: unknown): value is Type {
  return isPrimitiveType(value) || isContainerType(value)
}

export function isPrimitiveType(value: unknown): value is PrimitiveType {
  for (let name in primitives) {
    if (value === primitives[name as PrimitiveName]) return true
  }
  return false
}

export function isContainerType(value: unknown): value is ContainerType {
  for (let name in containers) {
    if (value instanceof containers[name as ContainerName]) return true
  }
  return false
}
