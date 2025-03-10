import React, {useEffect, useMemo, useRef} from "react"
import {useSelector} from "react-redux"
import {ListView} from "src/zui-kit"
import {useResultsPaneContext} from "./context"
import Slice from "src/js/state/Inspector"
import {useDispatch} from "src/core/use-dispatch"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import * as zed from "../../../../../packages/superdb-types/dist"
import {valueContextMenu} from "src/app/menus/value-context-menu"
import useSelect from "src/util/hooks/use-select"
import {ListViewApi} from "src/zui-kit"
import {PathView} from "./path-view"
import {AlertView} from "./alert-view"
import {showMenu} from "src/core/menu"
import Selection from "src/js/state/Selection"

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
    if (list.current?.nearBottom(30, top)) loadMore()
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
          const rootValue = field?.rootRecord || value
          dispatch(Selection.set({value, field, rootValue}))
          dispatch(viewLogDetail(rootValue))
        },
        onContextMenu: (e, value, field) => {
          e.preventDefault()
          const rootValue = field?.rootRecord || value
          dispatch(Selection.set({value, field, rootValue}))
          if (field && field instanceof zed.Field) {
            showMenu(valueContextMenu(value, field, field.rootRecord))
          }
        },
      }}
    />
  )
}
