import {useMemo} from "react"

export function useMemoObject<T extends object>(object: T) {
  const deps = Array.from(Object.values(object))
  return useMemo<T>(() => object, deps)
}
