/* @flow */

import React, {useEffect, useRef, useState} from "react"

import type {RowRenderer, ScrollPosition, ViewerDimens} from "../../types"
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

type Props = {
  chunker: Chunker,
  dimens: ViewerDimens,
  tableColumns: TableColumns,
  renderRow: RowRenderer,
  logs: Log[],
  onLastChunk?: Function,
  renderEnd: () => *,
  scrollPos: ScrollPosition
}

export default function Viewer(props: Props) {
  let [scrollLeft, setScrollLeft] = useState(0)
  let [chunks, setChunks] = useState(props.chunker.visibleChunks(0))
  let ref = useRef()
  function onScrollStart() {
    lib.doc.id("tooltip-root").style.display = "none"
  }

  function onScrollStop() {
    lib.doc.id("tooltip-root").style.display = "block"
  }

  let scrollHooks = useConst(null, () =>
    ScrollHooks.create(onScrollStart, onScrollStop)
  )

  function onScroll() {
    scrollHooks && scrollHooks()
    let view = ref.current
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
    let view = ref.current
    if (!view) return
    updateChunks(view.scrollTop)
    if (props.chunker.lastChunk() == chunks[chunks.length - 1]) {
      props.onLastChunk && props.onLastChunk()
    }
  })

  useEffect(() => {
    let view = ref.current
    if (!view) return
    if (props.scrollPos) {
      view.scrollTo(props.scrollPos.x, props.scrollPos.y)
    }
  }, [props.scrollPos.x, props.scrollPos.y])

  return (
    <div className="viewer">
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

const List = React.memo(function List(props) {
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
