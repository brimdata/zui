import React from "react"
import {NodeRendererProps} from "react-arborist"
import Icon from "src/app/core/icon-temp"
import {Item} from "src/app/features/sidebar/item"
import {ColumnTreeData} from "./types"

export function Node(props: NodeRendererProps<ColumnTreeData>) {
  const {node} = props
  const {field} = node.data
  return (
    <Item
      innerStyle={props.style}
      text={field.name + " " + getType(field.type)}
      onClick={() => props.node.toggle()}
      isFolder={props.node.isInternal}
      state={props.node.state}
    />
  )
}

function getType(type) {
  if (type.kind === "primitive") return type.name
  else return type.kind
}
