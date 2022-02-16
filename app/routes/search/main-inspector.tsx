import {zed} from "@brimdata/zealot"
import useSelect from "app/core/hooks/use-select"
import {Inspector} from "app/features/inspector/inspector"
import {InspectArgs} from "app/features/inspector/types"
import nextPageViewerSearch from "app/search/flows/next-page-viewer-search"
import searchFieldContextMenu from "ppl/menus/searchFieldContextMenu"
import React, {MouseEvent, useCallback} from "react"
import {useDispatch, useSelector} from "react-redux"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import Slice from "src/js/state/Inspector"
import Viewer from "src/js/state/Viewer"

export function MainInspector(props: {
  height: number
  width: number
  values: zed.Value[]
}) {
  const select = useSelect()
  const dispatch = useDispatch()
  const expanded = useSelector(Slice.getExpanded)
  const defaultExpanded = useSelector(Slice.getDefaultExpanded)

  function setExpanded(payload: {args: InspectArgs; isExpanded: boolean}) {
    dispatch(Slice.setExpanded(payload))
  }

  function isExpanded(value: zed.Value | zed.Type) {
    if (expanded.has(value)) {
      return expanded.get(value)
    } else {
      return defaultExpanded
    }
  }

  function loadMore() {
    if (select(Viewer.isFetching)) return
    if (select(Viewer.isComplete)) return
    if (select(Viewer.isLimited)) return
    dispatch(nextPageViewerSearch())
  }

  function onContextMenu(e: MouseEvent, value: zed.Value, field: zed.Field) {
    dispatch(
      searchFieldContextMenu({
        value,
        field,
        record: field.rootRecord
      })
    )
  }

  function onClick(e: MouseEvent, value: zed.Value, field: zed.Field) {
    dispatch(viewLogDetail(field.rootRecord))
  }

  return (
    <Inspector
      isExpanded={useCallback(isExpanded, [expanded, defaultExpanded])}
      setExpanded={useCallback(setExpanded, [])}
      loadMore={useCallback(loadMore, [])}
      onContextMenu={useCallback(onContextMenu, [])}
      onClick={useCallback(onClick, [])}
      {...props}
    />
  )
}
