import classNames from "classnames"
import React from "react"
import styled from "styled-components"
import Current from "src/js/state/Current"
import {showContextMenu} from "src/js/lib/System"
import {StyledArrow, Name, ItemBG, Rename, StyledItem} from "../common"
import Icon from "src/app/core/icon-temp"
import {useQueryItemMenu} from "../hooks"
import {lakeQueryPath} from "src/app/router/utils/paths"
import {useHistory} from "react-router"
import {useSelector} from "react-redux"

const FolderIcon = styled(Icon).attrs({name: "folder"})``
const QueryIcon = styled(Icon).attrs({name: "doc-plain"})``

const GroupArrow = styled(StyledArrow)`
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  margin: 0 6px 0 3px;
  opacity: 1;
  width: 8px;
  height: 8px;
`

const StyledQueryItem = styled(StyledItem)<{isSelected: boolean}>`
  ${({isSelected}) =>
    isSelected &&
    `
  outline: none;
  color: white;
  background: var(--primary-color);
  &:hover {
    background: var(--primary-color);
  }
  `} 
  ${GroupArrow} {
    stroke: ${(p) => (p.isSelected ? "white" : "rgba(0, 0, 0, 0.7)")};
  }

  ${FolderIcon} > svg, ${QueryIcon} > svg {
      margin-right: 8px;
      width: 14px;
      height: 14px;
      path {
        fill: ${(p) => (p.isSelected ? "white" : "rgba(0, 0, 0, 0.5)")};
      }
  }

  ${Name} {
    color: ${(p) => (p.isSelected ? "white" : "black")};
  }
`

export default function QueryItem({
  innerRef,
  styles,
  data,
  state,
  handlers,
  tree
}) {
  const {isEditing, isSelected} = state
  const {id} = data
  const isGroup = "items" in data
  const ctxMenu = useQueryItemMenu(data, tree, handlers)
  const history = useHistory()
  const lakeId = useSelector(Current.getLakeId)
  const query = useSelector(Current.getQuery)

  const onGroupClick = (e) => {
    e.stopPropagation()
    handlers.toggle(e)
  }

  const onItemClick = (e: React.MouseEvent) => {
    handlers.select(e, false)
    if (!e.metaKey && !e.shiftKey)
      history.push(lakeQueryPath(id, lakeId, {isDraft: false}))
  }

  const itemIcon = isGroup ? <FolderIcon /> : <QueryIcon />

  return (
    <ItemBG
      tabIndex={0}
      ref={innerRef}
      style={styles.row}
      className={classNames(state)}
      onClick={onItemClick}
      onContextMenu={() => showContextMenu(ctxMenu)}
    >
      <StyledQueryItem
        isSelected={isSelected || query?.id === id}
        style={styles.indent}
      >
        <GroupArrow
          isVisible={isGroup}
          show={data.isOpen}
          onClick={onGroupClick}
        />
        {itemIcon}
        {isEditing ? (
          <Rename item={data} onSubmit={handlers.submit} />
        ) : (
          <Name>{data.name}</Name>
        )}
      </StyledQueryItem>
    </ItemBG>
  )
}
