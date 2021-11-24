import containers, {ContainerType} from "./types/type-containers"
import primitives, {PrimitiveType} from "./types/type-primitives"
import {ZedTypeInterface} from "./types/types"

export function isType(value: unknown): value is ZedTypeInterface {
  return isPrimitiveType(value) || isContainerType(value)
}

export function isPrimitiveType(value: unknown): value is PrimitiveType {
  for (let name in primitives) {
    if (value === primitives[name]) return true
  }
  return false
}

export function isContainerType(value: unknown): value is ContainerType {
  for (let name in containers) {
    if (value instanceof containers[name]) return true
  }
  return false
}
