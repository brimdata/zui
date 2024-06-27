import React from "react"
import styled from "styled-components"
import {Icon} from "src/components/icon"
import {Item} from "../item"
import {NodeRendererProps} from "react-arborist"
import {Query} from "src/js/state/Queries/types"
import {queryContextMenu} from "src/app/menus/query-context-menu"
import {useAfterDelayOf} from "src/util/hooks/use-after-delay-of"
import {showMenu} from "src/core/menu"

const FolderIcon = styled(Icon).attrs({name: "folder"})``
const QueryIcon = styled(Icon).attrs({name: "query"})``

const QueryItem = ({
  dragHandle,
  style,
  node,
  tree,
}: NodeRendererProps<Query>) => {
  const itemIcon = node.isInternal ? <FolderIcon /> : <QueryIcon />

  const afterDelayOf = useAfterDelayOf()
  return (
    <Item
      innerRef={dragHandle}
      icon={itemIcon}
      text={node.data.name}
      state={node.state}
      innerStyle={style}
      isFolder={node.isInternal}
      onToggle={() => node.toggle()}
      onContextMenu={(e) => {
        e.stopPropagation()
        showMenu(queryContextMenu(tree, node))
      }}
      onSubmit={(name) => node.submit(name)}
      onReset={() => node.reset()}
      onClick={() =>
        afterDelayOf(480, () => node.isOnlySelection && node.edit())
      }
    />
  )
}

export default QueryItem
