import React, {useMemo, useState} from "react"
import {InspectList} from "./inspect-list"
import {List} from "./list.styled"
import {Row} from "./row"
import {InspectorProps} from "./types"

export function Inspector(props: InspectorProps) {
  const [visibleRange, setVisibleRange] = useState([0, 30] as [number, number])
  const list = useMemo(() => new InspectList(props), [props])
  list.fill(visibleRange)

  return (
    <List
      height={props.height}
      width={props.width}
      itemCount={list.count}
      itemSize={20}
      itemData={[...list.rows]}
      itemKey={(i) => i.toString()}
      onItemsRendered={(args) => {
        setVisibleRange([args.overscanStartIndex, args.overscanStopIndex])
        if (args.overscanStopIndex > list.rows.length - 30) props.loadMore()
      }}
    >
      {Row}
    </List>
  )
}
