import React, {useEffect, useRef, useState} from "react"

import {RowRenderer, ScrollPosition, ViewerDimens} from "../../types"
import {reactElementProps} from "../../test/integration"
import Chunk from "./Chunk"
import Chunker from "./Chunker"
import Header from "./Header"
import Log from "../../models/Log"
import ScrollHooks from "../../lib/ScrollHooks"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"
import lib from "../../lib"
import useConst from "../hooks/useConst"
import {useDispatch} from "react-redux"
import History from "../../state/History"

type Props = {
  chunker: Chunker
  dimens: ViewerDimens
  tableColumns: TableColumns
  renderRow: RowRenderer
  logs: Log[]
  onLastChunk?: Function
  renderEnd: () => any
  scrollPos: ScrollPosition
  innerRef: any
  timeZone: string
  timeFormat: string
}

export default function Viewer(props: Props) {
  const dispatch = useDispatch()
  const [scrollLeft, setScrollLeft] = useState(0)
  const [chunks, setChunks] = useState(props.chunker.visibleChunks(0))
  const ref = useRef<HTMLDivElement>()
  function onScrollStart() {
    lib.doc.id("tooltip-root").style.display = "none"
  }

  function onScrollStop() {
    const view = ref.current
    lib.doc.id("tooltip-root").style.display = "block"
    if (view) dispatch(History.update({x: view.scrollLeft, y: view.scrollTop}))
  }

  const scrollHooks = useConst(null, () =>
    ScrollHooks.create(onScrollStart, onScrollStop)
  )

  function onScroll() {
    scrollHooks && scrollHooks()
    const view = ref.current
    if (view) {
      updateChunks(view.scrollTop)
      setScrollLeft(view.scrollLeft)
    }
  }

  function updateChunks(scrollTop) {
    const next = props.chunker.visibleChunks(scrollTop)
    if (!Chunker.isEqual(next, chunks)) setChunks(next)
  }

  useEffect(() => {
    const view = ref.current
    if (!view) return
    updateChunks(view.scrollTop)
    if (props.chunker.lastChunk() == chunks[chunks.length - 1]) {
      props.onLastChunk && props.onLastChunk()
    }
  })

  useEffect(() => {
    const view = ref.current
    if (!view) return
    if (props.scrollPos) {
      view.scrollTo(props.scrollPos.x, props.scrollPos.y)
    }
  }, [props.scrollPos])

  return (
    <div className="viewer" ref={props.innerRef} tabIndex={0}>
      <Header
        columns={props.tableColumns}
        dimens={props.dimens}
        scrollLeft={scrollLeft}
        {...reactElementProps("viewer_header")}
      />
      <div
        className="view"
        onScroll={onScroll}
        style={{
          width: props.dimens.viewWidth,
          height: props.dimens.viewHeight
        }}
        ref={ref}
      >
        <List {...{...props, chunks}} />
      </div>
    </div>
  )
}

type ListProps = {
  chunks: number[]
} & Props

const List = React.memo<ListProps>(function List(props) {
  return (
    <div
      className="list"
      style={Styler.list(props.dimens)}
      {...reactElementProps("viewer_results")}
    >
      {props.chunks.map((chunk) => (
        <Chunk
          columns={props.tableColumns}
          logs={props.logs}
          rows={props.chunker.rows(chunk)}
          key={chunk}
          rowRenderer={props.renderRow}
          dimens={props.dimens}
        />
      ))}
      {props.renderEnd()}
    </div>
  )
})
