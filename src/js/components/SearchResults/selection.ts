import {throttle} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import {useLayoutEffect, MouseEvent} from "react"
import Mousetrap from "mousetrap"

import Viewer from "../../state/Viewer"
import useCallbackRef from "../hooks/useCallbackRef"
import useSelect from "src/app/core/hooks/use-select"

function useKeybindings(count: number) {
  const dispatch = useDispatch()
  const [focusParent, ref] = useCallbackRef()
  const select = useSelect()

  useLayoutEffect(() => {
    if (!focusParent) return

    function onDown(e) {
      e.preventDefault()
      const selection = select(Viewer.getSelection)
      const index = selection.getIndices()[0]
      dispatch(Viewer.select(index ? Math.min(index + 1, count - 1) : 0))
    }

    function onUp(e) {
      e.preventDefault()
      const selection = select(Viewer.getSelection)
      const index = selection.getIndices()[0]
      dispatch(Viewer.select(index ? Math.max(index - 1, 0) : 0))
    }

    const bindings = new Mousetrap(focusParent)
      .bind("down", throttle(onDown, 25))
      .bind("up", throttle(onUp, 25))

    return () => {
      bindings.reset()
    }
  }, [focusParent])

  return ref
}

type Args = {count: number}

export function useRowSelection({count}: Args) {
  const parentRef = useKeybindings(count)
  const selection = useSelector(Viewer.getSelection)
  const dispatch = useDispatch()

  function clicked(e: MouseEvent, index: number) {
    dispatch(Viewer.select(index))
  }

  return {
    parentRef,
    selection,
    clicked,
  }
}
