import React from "react"
import {NodeRendererProps} from "react-arborist"
import {Snapshot} from "src/models/snapshot"
import {HistoryHandler} from "./handler"
import classNames from "classnames"

type Props = NodeRendererProps<Snapshot> & {handler: HistoryHandler}

export function HistoryItem({node, handler, style}: Props) {
  return (
    <div
      style={style}
      className="h-full"
      onClick={() => handler.onActivate(node.data.id)}
    >
      <div className="h-full gutter-half">
        <div className="sidebar-item gutter-half h-full repel step--1 flex-nowrap">
          <span
            className={classNames("truncate font:mono", {
              "weight:bold": node.data.query,
            })}
          >
            {node.data.query?.name ?? node.data.queryText}
          </span>
          <span className="nowrap text-meta">
            {handler.formatTimestamp(node.data.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
