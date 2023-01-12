import {zed} from "@brimdata/zealot"
import useSelect from "src/app/core/hooks/use-select"
import {Inspector} from "src/app/features/inspector/inspector"
import searchFieldContextMenu from "src/ppl/menus/searchFieldContextMenu"
import React, {useCallback, MouseEvent, useMemo} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import Slice from "src/js/state/Inspector"
import {debounce, isNumber} from "lodash"
import Results from "src/js/state/Results"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import {PathView} from "./path-view"

export function MainInspector(props: {
  height: number
  width: number
  values: zed.Value[]
}) {
  const select = useSelect()
  const dispatch = useDispatch()
  const expanded = useSelector(Slice.getExpanded)
  const valuePages = useSelector(Slice.getValuePages)
  const defaultExpanded = useSelector(Slice.getDefaultExpanded)

  function setExpanded(key: string, isExpanded: boolean) {
    dispatch(Slice.setExpanded({key, isExpanded}))
  }

  function isExpanded(key: string) {
    if (expanded.has(key)) {
      return expanded.get(key)
    } else {
      return defaultExpanded
    }
  }

  function getValuePage(key: string) {
    const page = valuePages.get(key)
    return isNumber(page) ? page : 1
  }

  function incValuePage(key: string) {
    dispatch(Slice.incValuePage({key}))
  }

  function loadMore() {
    if (select(Results.isFetching(MAIN_RESULTS))) return
    if (select(Results.isComplete(MAIN_RESULTS))) return
    if (select(Results.isLimited(MAIN_RESULTS))) return
    dispatch(Results.fetchNextPage())
  }

  function onContextMenu(e, value: zed.Value, field: zed.Field) {
    dispatch(
      searchFieldContextMenu({
        value,
        field,
        record: field.rootRecord,
      })
    )
  }

  function onClick(e: MouseEvent, value: zed.Value, field: zed.Field) {
    dispatch(viewLogDetail(field.rootRecord))
  }

  function onScroll({top, left}) {
    dispatch(Slice.setScrollPosition({top, left}))
  }

  const safeOnScroll = useMemo(
    () => debounce(onScroll, 250, {trailing: true, leading: false}),
    []
  )

  const initialScrollPosition = useMemo(
    () => select(Slice.getScrollPosition),
    []
  )

  return (
    <Inspector
      initialScrollPosition={initialScrollPosition}
      onScroll={safeOnScroll}
      isExpanded={useCallback(isExpanded, [expanded, defaultExpanded])}
      setExpanded={useCallback(setExpanded, [])}
      getValuePage={useCallback(getValuePage, [valuePages])}
      incValuePage={useCallback(incValuePage, [])}
      loadMore={useCallback(loadMore, [])}
      onContextMenu={useCallback(onContextMenu, [])}
      onClick={useCallback(onClick, [])}
      customViews={[PathView]}
      {...props}
    />
  )
}
