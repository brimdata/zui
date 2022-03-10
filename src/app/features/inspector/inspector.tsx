import React, {useMemo, useRef, useState} from "react"
import {useOnScroll} from "./hooks/scroll"
import {useInitialScrollPosition} from "./hooks/scroll-position"
import {InspectList} from "./inspect-list"
import {List} from "./list.styled"
import {Row} from "./row"
import {InspectorProps} from "./types"

export function Inspector(props: InspectorProps) {
  const outerRef = useRef<HTMLDivElement>()
  const [visibleRange, setVisibleRange] = useState([0, 30] as [number, number])
  const list = useMemo(() => new InspectList(props), [props])
  list.fill(visibleRange)

  useOnScroll(outerRef, props)
  useInitialScrollPosition(outerRef, props)

  return (
    <List
      innerRef={props.innerRef}
      outerRef={outerRef}
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
