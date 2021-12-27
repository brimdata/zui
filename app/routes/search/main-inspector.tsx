import {zed} from "@brimdata/zealot"
import {Inspector} from "app/features/inspector/inspector"
import {InspectArgs} from "app/features/inspector/types"
import React, {useCallback} from "react"
import {useDispatch, useSelector} from "react-redux"
import Slice from "src/js/state/Inspector"

export function MainInspector(props: {
  height: number
  width: number
  values: zed.Value[]
}) {
  const dispatch = useDispatch()
  const expanded = useSelector(Slice.getExpanded)
  const defaultExpanded = useSelector(Slice.getDefaultExpanded)

  function setExpanded(payload: {args: InspectArgs; isExpanded: boolean}) {
    dispatch(Slice.setExpanded(payload))
  }

  function isExpanded(value: zed.Value) {
    if (expanded.has(value)) {
      return expanded.get(value)
    } else {
      return defaultExpanded
    }
  }

  return (
    <Inspector
      isExpanded={useCallback(isExpanded, [expanded, defaultExpanded])}
      setExpanded={useCallback(setExpanded, [])}
      {...props}
    />
  )
}
