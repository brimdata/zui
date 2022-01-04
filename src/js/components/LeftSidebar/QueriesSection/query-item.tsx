import classNames from "classnames"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import styled from "styled-components"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import SearchBar from "src/js/state/SearchBar"
import {AppDispatch} from "src/js/state/types"
import {brimQueryLib} from "test/playwright/helpers/locators"
import {showContextMenu} from "src/js/lib/System"
import {StyledArrow, Name, ItemBG, Rename, StyledItem} from "../common"
import Icon from "app/core/Icon"
import {useQueryItemMenu} from "../hooks"

const FolderIcon = styled(Icon).attrs({name: "folder"})``
const QueryIcon = styled(Icon).attrs({name: "doc-plain"})``

const GroupArrow = styled(StyledArrow)`
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  margin: 0 6px;
  width: 10px;
  height: 10px;
`

const StyledQueryItem = styled(StyledItem)<{isSelected: boolean}>`
  ${({isSelected}) =>
    isSelected &&
    `
  outline: none;
  color: white;
  background: var(--havelock);
  `} 
  ${GroupArrow} {
    margin: 0 3px 0 3px;
    opacity: 1;
    stroke: ${(p) => (p.isSelected ? "white" : "var(--slate)")};
  }

  ${FolderIcon} > svg, ${QueryIcon} > svg {
      margin-right: 8px;
      width: 14px;
      height: 14px;
      fill: ${(p) => (p.isSelected ? "white" : "inherit")};
      stroke: ${(p) => (p.isSelected ? "white" : "inherit")};
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
  const dispatch = useDispatch<AppDispatch>()
  const currentPool = useSelector(Current.getPool)
  const {isEditing, isSelected} = state
  const {value, id} = data
  const isGroup = "items" in data
  const ctxMenu = useQueryItemMenu(data, tree, handlers)

  const onGroupClick = (e) => {
    e.stopPropagation()
    handlers.toggle(e)
  }

  const onItemClick = (e: React.MouseEvent) => {
    if (!currentPool)
      return dispatch(
        Notice.set({type: "NoPoolError", message: "No Pool Selected"})
      )

    handlers.select(e, false)
    if (value && !e.metaKey && !e.shiftKey) {
      dispatch(SearchBar.clearSearchBar())
      dispatch(SearchBar.changeSearchBarInput(value))
      dispatch(submitSearch())
    }
  }

  const itemIcon = isGroup ? <FolderIcon /> : <QueryIcon />
  const maybeBrimLibTestProps = id === "brim" && brimQueryLib.props

  return (
    <ItemBG
      tabIndex={0}
      ref={innerRef}
      style={styles.row}
      className={classNames(state)}
      onClick={onItemClick}
      onContextMenu={() => showContextMenu(ctxMenu)}
      {...maybeBrimLibTestProps}
    >
      <StyledQueryItem isSelected={isSelected} style={styles.indent}>
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
