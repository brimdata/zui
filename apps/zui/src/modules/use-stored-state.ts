import {useState} from "react"
import {StorageSlice} from "./storage-slice"

export function useStoredState<T>(
  key: string,
  init: T,
  coerce: (string: string) => T
) {
  const storage = new StorageSlice<T>(key, coerce)
  const [state, setState] = useState<T>(storage.get() || init)

  function setStoredState(value: T) {
    const next = typeof value === "function" ? value(state) : value
    storage.set(next)
    setState(next)
  }

  return [state, setStoredState] as const
}
