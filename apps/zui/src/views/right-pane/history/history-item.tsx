import React from "react"
import {NodeRendererProps} from "react-arborist"
import {Snapshot} from "src/models/snapshot"
import {HistoryHandler} from "./handler"

type Props = NodeRendererProps<Snapshot> & {handler: HistoryHandler}

export function HistoryItem({node, handler, style}: Props) {
  return (
    <div
      style={style}
      className="h-full"
      onClick={() => handler.onActivate(node.data.id)}
    >
      <div className="h-full gutter-half">
        <div className="sidebar-item gutter-half h-full flex items-center">
          <span className="truncate font:mono step--1">
            {node.data.queryText}
          </span>
        </div>
      </div>
    </div>
  )
}
