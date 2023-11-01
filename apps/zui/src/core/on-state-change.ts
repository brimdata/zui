import {Selector} from "@reduxjs/toolkit"
import {Store} from "src/js/state/types"

export function onStateChange(
  store: Store,
  selector: Selector,
  onChange: (value: any) => void
) {
  let first = true
  let prev = undefined
  store.subscribe(() => {
    const next = selector(store.getState())
    if (prev !== next || first) onChange(next)
    prev = next
    first = false
  })
}
