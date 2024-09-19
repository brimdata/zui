import React from "react"
import {NodeRendererProps} from "react-arborist"
import {Snapshot} from "src/models/snapshot"
import {HistoryHandler} from "./handler"

type Props = NodeRendererProps<Snapshot> & {handler: HistoryHandler}

export function HistoryItem({node, handler}: Props) {
  return (
    <div onClick={() => handler.onClick(node.data.id)}>
      {node.data.queryText}
    </div>
  )
}
