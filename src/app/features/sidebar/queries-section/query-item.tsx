import React from "react"
import styled from "styled-components"
import Current from "src/js/state/Current"
import {showContextMenu} from "src/js/lib/System"
import Icon from "src/app/core/icon-temp"
import {lakeQueryPath} from "src/app/router/utils/paths"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import {Item} from "../item"
import {NodeRenderer} from "react-arborist"
import getQueryItemCtxMenu from "../flows/get-query-item-ctx-menu"
import tabHistory from "../../../router/tab-history"
import SessionHistories from "../../../../js/state/SessionHistories"
import getQueryById from "../../../../js/state/Queries/flows/get-query-by-id"

const FolderIcon = styled(Icon).attrs({name: "folder"})``
const QueryIcon = styled(Icon).attrs({name: "query"})``

const QueryItem: NodeRenderer<any> = ({
  innerRef,
  styles,
  data,
  state,
  handlers,
  tree,
}) => {
  const {id} = data
  const isGroup = "items" in data
  const lakeId = useSelector(Current.getLakeId)
  const dispatch = useDispatch()
  const itemIcon = isGroup ? <FolderIcon /> : <QueryIcon />
  const latestVersionId = dispatch(getQueryById(id))?.latestVersionId()

  const onGroupClick = (e) => {
    e.stopPropagation()
    handlers.toggle(e)
  }

  const onItemClick = (e: React.MouseEvent) => {
    handlers.select(e, {selectOnClick: true})
    if (!e.metaKey && !e.shiftKey) {
      dispatch(tabHistory.push(lakeQueryPath(id, lakeId, latestVersionId)))
      dispatch(SessionHistories.push(id))
    }
  }

  const onItemDoubleClick = (e: React.MouseEvent) => {
    if (isGroup) return
    if (!e.metaKey && !e.shiftKey) {
      dispatch(tabHistory.push(lakeQueryPath(id, lakeId, latestVersionId)))
      dispatch(SessionHistories.push(id))
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
      onDoubleClick={onItemDoubleClick}
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
