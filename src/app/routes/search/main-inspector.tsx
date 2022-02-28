import {zed} from "@brimdata/zealot"
import useSelect from "src/app/core/hooks/use-select"
import {Inspector} from "src/app/features/inspector/inspector"
import {InspectArgs} from "src/app/features/inspector/types"
import nextPageViewerSearch from "src/app/search/flows/next-page-viewer-search"
import searchFieldContextMenu from "src/ppl/menus/searchFieldContextMenu"
import React, {MouseEvent, useCallback} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useRowSelection} from "src/js/components/SearchResults/selection"
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
  const {parentRef, clicked} = useRowSelection({
    multi: false
  })

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

  function onClick(
    e: MouseEvent,
    value: zed.Value,
    field: zed.Field,
    index: number
  ) {
    dispatch(viewLogDetail(field.rootRecord))
    clicked(e, index)
  }

  return (
    <Inspector
      innerRef={parentRef}
      isExpanded={useCallback(isExpanded, [expanded, defaultExpanded])}
      setExpanded={useCallback(setExpanded, [])}
      loadMore={useCallback(loadMore, [])}
      onContextMenu={useCallback(onContextMenu, [])}
      onClick={useCallback(onClick, [])}
      {...props}
    />
  )
}
