import nextPageViewerSearch from "app/search/flows/next-page-viewer-search"
import {isEqual} from "lodash"
// @ts-strict
import React, {ComponentType, ReactNode} from "react"
import {useDispatch, useSelector} from "react-redux"
import {ListChildComponentProps} from "react-window"
import Viewer from "src/js/state/Viewer"
import {zed} from "zealot"
import {inspect} from "./inspect"
import {List} from "./list.styled"
import {Context, RowData} from "./types"

type Props = {
  height: number
  width: number
  values: zed.AnyValue[]
  defaultExpanded: boolean
  expanded: Map<zed.AnyValue, boolean>
  setExpanded: (m: Map<zed.AnyValue, boolean>) => void
  onContextMenu: Context["onContextMenu"]
}

export function Inspector(props: Props) {
  const dispatch = useDispatch()
  const isFetching = useSelector(Viewer.getStatus) === "FETCHING"
  const isIncomplete = useSelector(Viewer.getEndStatus) === "INCOMPLETE"
  const {defaultExpanded, expanded, setExpanded} = props
  const context: Context = {
    indent: 0,
    rows: [],
    onContextMenu: props.onContextMenu,
    nest() {
      this.indent += 1
    },
    unnest() {
      this.indent -= 1
    },
    push(render: ReactNode) {
      this.rows.push({render, indent: this.indent})
    },
    isExpanded: (value: zed.AnyValue) => {
      if (expanded.has(value)) return expanded.get(value)
      else return defaultExpanded
    },
    setExpanded: (value: zed.AnyValue, bool: boolean) => {
      const newMap = new Map(expanded.entries())
      newMap.set(value, bool)
      setExpanded(newMap)
    }
  }

  for (const v of props.values) {
    inspect({
      ctx: context,
      value: v,
      field: null,
      key: null,
      last: true,
      // @ts-ignore
      type: v.type
    })
  }

  return (
    <List
      height={props.height}
      width={props.width}
      itemCount={context.rows.length}
      itemSize={20}
      itemData={context.rows}
      itemKey={(i) => i.toString()}
      onItemsRendered={({visibleStopIndex}) => {
        if (visibleStopIndex > context.rows.length - 30)
          if (isIncomplete && !isFetching) {
            dispatch(nextPageViewerSearch())
          }
      }}
    >
      {Row}
    </List>
  )
}

const Row: ComponentType<ListChildComponentProps> = React.memo(
  function Row({style, index, data}) {
    const {render, indent}: RowData = data[index]
    const innerStyle = {paddingLeft: 12 * (indent + 1)}

    return (
      <div className="inspector-row" style={{...style, ...innerStyle}}>
        {render}
      </div>
    )
  },
  (prev, next) => {
    return (
      prev.data === next.data &&
      prev.index === next.index &&
      isEqual(prev.style, next.style)
    )
  }
)
