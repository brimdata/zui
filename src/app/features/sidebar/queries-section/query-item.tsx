import React from "react"
import styled from "styled-components"
import Current from "src/js/state/Current"
import {showContextMenu} from "src/js/lib/System"
import Icon from "src/app/core/icon-temp"
import {lakeQueryPath} from "src/app/router/utils/paths"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Tabs from "src/js/state/Tabs"
import {Item} from "../item"
import {NodeRenderer} from "react-arborist"
import getQueryItemCtxMenu from "../flows/get-query-item-ctx-menu"

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
  const {id} = data
  const isGroup = "items" in data
  const lakeId = useSelector(Current.getLakeId)
  const dispatch = useDispatch()
  const itemIcon = isGroup ? <FolderIcon /> : <QueryIcon />

  const onGroupClick = (e) => {
    e.stopPropagation()
    handlers.toggle(e)
  }

  const onItemClick = (e: React.MouseEvent) => {
    handlers.select(e, {selectOnClick: true})
    if (!e.metaKey && !e.shiftKey) {
      dispatch(Tabs.activateByUrl(lakeQueryPath(id, lakeId)))
    }
  }

  return (
    <Item
      innerRef={innerRef}
      icon={itemIcon}
      text={data.name}
      state={state}
      styles={styles}
      onClick={isGroup ? onGroupClick : onItemClick}
      isFolder={isGroup}
      onContextMenu={() => {
        showContextMenu(
          dispatch(getQueryItemCtxMenu({data, tree, handlers, lakeId}))
        )
      }}
      onSubmit={handlers.submit}
    />
  )
}

export default QueryItem
