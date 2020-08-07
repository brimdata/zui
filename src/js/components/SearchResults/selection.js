/* @flow */
import {throttle} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import {useLayoutEffect} from "react"
import Mousetrap from "mousetrap"

import Viewer from "../../state/Viewer"
import useCallbackRef from "../hooks/useCallbackRef"

function useKeybindings() {
  const dispatch = useDispatch()
  const [focusParent, ref] = useCallbackRef()

  useLayoutEffect(() => {
    if (!focusParent) return

    function onDown(e) {
      e.preventDefault()
      dispatch(Viewer.selectNext())
    }

    function onShiftDown(e) {
      e.preventDefault()
      dispatch(Viewer.selectRangeNext())
    }

    function onUp(e) {
      e.preventDefault()
      dispatch(Viewer.selectPrev())
    }

    function onShiftUp(e) {
      e.preventDefault()
      dispatch(Viewer.selectRangePrev())
    }

    function selectAll(e) {
      e.preventDefault()
      dispatch(Viewer.selectAll())
    }

    const bindings = new Mousetrap(focusParent)
      .bind("down", throttle(onDown, 25))
      .bind("shift+down", throttle(onShiftDown, 25))
      .bind("up", throttle(onUp, 25))
      .bind("shift+up", throttle(onShiftUp, 25))
      .bind("meta+a", selectAll)

    return () => bindings.reset()
  }, [focusParent])

  return ref
}

export function useRowSelection() {
  const parentRef = useKeybindings()
  const selection = useSelector(Viewer.getSelection)
  const dispatch = useDispatch()

  function clicked(e: KeyboardEvent, index: number) {
    if (e.metaKey) {
      dispatch(Viewer.selectMulti(index))
    } else if (e.shiftKey) {
      dispatch(Viewer.selectRange(index))
    } else {
      dispatch(Viewer.select(index))
    }
  }

  return {
    parentRef,
    selection,
    clicked
  }
}
