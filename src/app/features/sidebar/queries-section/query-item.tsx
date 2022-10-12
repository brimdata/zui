import React from "react"
import styled from "styled-components"
import Icon from "src/app/core/icon-temp"
import {Item} from "../item"
import {NodeRendererProps} from "react-arborist"
import {Query} from "src/js/state/Queries/types"
import {queryContextMenu} from "src/app/menus/query-context-menu"

const FolderIcon = styled(Icon).attrs({name: "folder"})``
const QueryIcon = styled(Icon).attrs({name: "query"})``

const QueryItem = ({
  dragHandle,
  style,
  node,
  tree,
}: NodeRendererProps<Query>) => {
  const itemIcon = node.isInternal ? <FolderIcon /> : <QueryIcon />

  return (
    <Item
      innerRef={dragHandle}
      icon={itemIcon}
      text={node.data.name}
      state={node.state}
      innerStyle={style}
      isFolder={node.isInternal}
      onToggle={() => node.toggle()}
      onContextMenu={() => queryContextMenu.build(tree, node).show()}
      onSubmit={(name) => node.submit(name)}
    />
  )
}

export default QueryItem
