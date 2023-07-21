import React, {useEffect, useMemo, useRef} from "react"
import {useSelector} from "react-redux"
import {ListView} from "src/zui-kit/react/list-view"
import {useResultsPaneContext} from "./context"
import Slice from "src/js/state/Inspector"
import {useDispatch} from "src/app/core/state"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import * as zed from "@brimdata/zed-js"
import {valueContextMenu} from "src/app/menus/value-context-menu"
import useSelect from "src/app/core/hooks/use-select"
import {ListViewApi} from "src/zui-kit"
import {PathView} from "src/app/query-home/results/path-view"
import {AlertView} from "src/app/query-home/results/alert-view"

export function Inspector(props: {height?: number}) {
  const {values, shapes, width, height, loadMore, key} = useResultsPaneContext()
  const select = useSelect()
  const dispatch = useDispatch()
  const initialScrollPosition = useMemo(
    () => select(Slice.getScrollPosition),
    []
  )
  const list = useRef<ListViewApi>()

  function onScroll({top, left}) {
    dispatch(Slice.setScrollPosition({top, left}))
    if (list.current?.nearBottom(30)) loadMore()
  }

  useEffect(() => {
    const pos = select(Slice.getScrollPosition)
    list.current?.scrollTo(pos)
  }, [key])

  return (
    <ListView
      ref={list}
      className="zed-list-view"
      values={values}
      shapes={shapes}
      width={width}
      height={props.height ?? height}
      onScroll={onScroll}
      initialScrollPosition={initialScrollPosition}
      viewConfig={{
        customViews: [PathView, AlertView],
      }}
      valueExpandedState={{
        value: useSelector(Slice.getExpanded),
        onChange: (next) => dispatch(Slice.setExpanded(next)),
      }}
      valuePageState={{
        value: useSelector(Slice.getPages),
        onChange: (next) => dispatch(Slice.setPages(next)),
      }}
      valueExpandedDefaultState={{
        value: useSelector(Slice.getExpandedDefault),
        onChange: (next) => dispatch(Slice.setExpandedDefault(next)),
      }}
      valueProps={{
        onClick: (e, value, field) => {
          if (field && field instanceof zed.Field) {
            dispatch(viewLogDetail(field.rootRecord))
          }
        },
        onContextMenu: (e, value, field) => {
          e.preventDefault()
          if (field && field instanceof zed.Field) {
            valueContextMenu.build(value, field, field.rootRecord).show()
          }
        },
      }}
    />
  )
}
