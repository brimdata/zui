import {Selector} from "@reduxjs/toolkit"
import {Store} from "src/js/state/types"

export function onStateChange(
  store: Store,
  selector: Selector,
  onChange: (value: any) => void
) {
  let current = undefined

  function listener() {
    const next = selector(store.getState())
    if (next !== current) {
      current = next
      onChange(current)
    }
  }

  const unsubscribe = store.subscribe(listener)
  listener()
  return unsubscribe
}
