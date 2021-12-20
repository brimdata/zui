import {isEqual} from "lodash"
import React, {ComponentType, useRef, useState} from "react"
import {ListChildComponentProps} from "react-window"
import {InspectorContext} from "./context"
import {List} from "./list.styled"
import {InspectorProps, RowData} from "./types"

export function InspectorFast(props: InspectorProps) {
  const context = useRef(new InspectorContext(props))
  if (props.values.length === 0) {
    context.current = new InspectorContext(props)
  } else {
    // Todo fix this
    context.current.props = props
  }

  const [stop, setStop] = useState(0)

  context.current.buildRows(stop)
  const rows = [...context.current.rows]

  console.log("<InspectorFast />", rows.length)
  return (
    <List
      height={props.height}
      width={props.width}
      itemCount={Math.max(rows.length, props.values.length)}
      itemSize={props.rowHeight}
      itemData={rows}
      itemKey={(i) => i.toString()}
      onItemsRendered={({overscanStopIndex}) => setStop(overscanStopIndex)}
    >
      {Row}
    </List>
  )
}

const Row: ComponentType<ListChildComponentProps> = React.memo(
  function Row({style, index, data}) {
    if (!data[index]) return null
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

function setStopIndex(overscanStopIndex: number): any {
  throw new Error("Function not implemented.")
}
