import React from "react"
import styled from "styled-components"
import Current from "src/js/state/Current"
import {showContextMenu} from "src/js/lib/System"
import Icon from "src/app/core/icon-temp"
import {useQueryItemMenu} from "../hooks"
import {lakeQueryPath} from "src/app/router/utils/paths"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Tabs from "src/js/state/Tabs"
import {Item} from "../item"
import {NodeRenderer} from "react-arborist"

const FolderIcon = styled(Icon).attrs({name: "folder"})``
const QueryIcon = styled(Icon).attrs({name: "doc-plain"})``

const QueryItem: NodeRenderer<any> = ({
  innerRef,
  styles,
  data,
  state,
  handlers,
  tree
}) => {
  const {isEditing, isSelected} = state
  const {id} = data
  const isGroup = "items" in data
  const ctxMenu = useQueryItemMenu(data, tree, handlers)
  const dispatch = useDispatch()
  const lakeId = useSelector(Current.getLakeId)
  const query = useSelector(Current.getQuery)
  const onGroupClick = (e) => {
    e.stopPropagation()
    handlers.toggle(e)
  }

  const onItemClick = (e: React.MouseEvent) => {
    handlers.select(e, true)
    if (!e.metaKey && !e.shiftKey) {
      dispatch(Tabs.activateByUrl(lakeQueryPath(id, lakeId, {isDraft: false})))
    }
  }

  const itemIcon = isGroup ? <FolderIcon /> : <QueryIcon />

  return (
    <Item
      innerRef={innerRef}
      icon={itemIcon}
      text={data.name}
      onClick={isGroup ? onGroupClick : onItemClick}
      onContextMenu={() => showContextMenu(ctxMenu)}
      style={styles.row}
      indentStyle={styles.indent}
      isSelected={isSelected || query?.id == id}
      isSelectedStart={state.isFirstOfSelected}
      isSelectedEnd={state.isLastOfSelected}
      isFolder={isGroup}
      isOpen={state.isOpen}
      isEditing={isEditing}
    />
  )
}

export default QueryItem
