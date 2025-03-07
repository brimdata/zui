import {Selector} from "@reduxjs/toolkit"
import {Store} from "src/js/state/types"

export function onStateChange(
  store: Store,
  selector: Selector,
  onChange: (value: any) => void,
  options: {skipInitial?: boolean} = {}
) {
  let initial = true
  let current = undefined

  function listener() {
    const value = selector(store.getState())
    if (initial) {
      initial = false
      current = value
      if (!options.skipInitial) onChange(current)
    } else if (value !== current) {
      current = value
      onChange(current)
    }
  }

  const unsubscribe = store.subscribe(listener)
  listener()
  return unsubscribe
}
