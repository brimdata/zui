import {throttle} from "lodash"
import Mousetrap from "mousetrap"
import {RefObject, useEffect} from "react"
import Selector from "../models/selector"

export function useKeyBindings(
  ref: RefObject<any>,
  selector: Selector,
  setSelector: (s: Selector) => void
) {
  useEffect(() => {
    const onShiftDown = (e) => {
      e.preventDefault()
      selector.selectRangeNext()
      setSelector(selector.dup())
    }

    const onShiftUp = (e) => {
      e.preventDefault()
      selector.selectRangePrev()
      setSelector(selector.dup())
    }

    const selectAll = (e) => {
      e.preventDefault()
      selector.selectAll()
      setSelector(selector.dup())
    }

    const bindings = new Mousetrap(ref.current)
      .bind(["shift+down", "shift+meta+down"], throttle(onShiftDown, 25))
      .bind(["shift+up", "shift+meta+up"], throttle(onShiftUp, 25))
      .bind("meta+a", selectAll)

    return () => bindings.reset()
  }, [selector])
}
