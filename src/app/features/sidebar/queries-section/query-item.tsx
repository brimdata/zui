import React from "react"
import styled from "styled-components"
import Current from "src/js/state/Current"
import {showContextMenu} from "src/js/lib/System"
import Icon from "src/app/core/icon-temp"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import {Item} from "../item"
import {NodeRenderer} from "react-arborist"
import getQueryItemCtxMenu from "../flows/get-query-item-ctx-menu"
import {useBrimApi} from "src/app/core/context"

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
  const api = useBrimApi()
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
      api.queries.open(id)
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
