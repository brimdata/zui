import classNames from "classnames"
import React, {useLayoutEffect, useRef} from "react"
import styled from "styled-components"
import Notice from "../../state/Notice"
import {useDispatch, useSelector} from "react-redux"
import Current from "../../state/Current"
import SearchBar from "../../state/SearchBar"
import {submitSearch} from "../../flows/submitSearch/mod"
import {MenuItemConstructorOptions, remote} from "electron"
import toast from "react-hot-toast"
import Modal from "../../state/Modal"
import Queries from "../../state/Queries"
import usePopupMenu from "../hooks/usePopupMenu"
import lib from "src/js/lib"
import Folder from "../../icons/Folder"
import {StyledArrow} from "../LeftPane/common"
import StarNoFillIcon from "../../icons/StarNoFillIcon"

const BG = styled.div`
  padding-left: 12px;
  height: 24px;
  font-family: system-ui;
  font-weight: 400;
  font-size: 11px;
  line-height: 24px;
  color: var(--aqua);
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: default;
  user-select: none;
  outline: none;

  &:hover:not(.isSelected) {
    background: rgba(0, 0, 0, 0.03);
  }

  &:active:not(.isSelected) {
    background: rgba(0, 0, 0, 0.08);
  }

  &.isSelected {
    background: var(--havelock);
    color: white;
  }
`

const Name = styled.p`
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  flex: 1;
`

const Input = styled.input`
  font-size: 11px;
  font-family: system-ui;
  font-weight: 400;
  line-height: 19px;
  color: var(--aqua);
  padding: 0 1px;
  border: 1px solid var(--havelock);
  height: 19px;
  outline: none;
  border-radius: 2px;
  margin: 0 2px 0 -2px;
  width: 100%;
`

const GroupArrow = styled(StyledArrow)`
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  margin-right: 6px;
  margin-left: 0;
  width: 8px;
  height: 8px;
`

const StyledItem = styled.div<{isSelected: boolean}>`
  display: flex;
  align-items: center;

  ${GroupArrow} {
    opacity: ${(p) => (p.isSelected ? 1 : 0.45)};
    fill: ${(p) => (p.isSelected ? "white" : "var(--slate)")};
  }

  ${Folder}, ${StarNoFillIcon} {
    margin-right: 6px;
    width: 13px;
    height: 13px;
  }

  ${Folder} {
    fill: ${(p) => (p.isSelected ? "white" : "var(--slate)")};
  }

  ${StarNoFillIcon} {
    fill: ${(p) => (p.isSelected ? "white" : "var(--lead)")};
  }
`

function Show({item}) {
  return <Name>{item.name}</Name>
}

function Rename({item, onSubmit}) {
  const input = useRef(null)
  useLayoutEffect(() => input.current && input.current.select(), [])
  // useOutsideClick(input, () => ctx.onRename(item, input.current.value))
  const onKey = (e) => {
    if (e.key === "Enter") onSubmit(input.current.value)
    else if (e.key === "Escape") onSubmit(item.name)
  }

  return (
    <Input
      ref={input}
      onKeyDown={onKey}
      type="text"
      autoFocus
      defaultValue={item.name}
    />
  )
}

export default function Item({innerRef, styles, data, state, handlers, tree}) {
  const dispatch = useDispatch()
  const currentPool = useSelector(Current.getPool)
  const {isEditing, isSelected} = state
  const {value} = data

  const runQuery = (value) => {
    dispatch(SearchBar.clearSearchBar())
    dispatch(SearchBar.changeSearchBarInput(value))
    dispatch(submitSearch())
  }

  const onGroupClick = (e) => {
    e.stopPropagation()
    dispatch(Queries.toggleGroup(data.id))
    handlers.toggle(e)
  }

  const onItemClick = (e) => {
    if (!currentPool)
      return dispatch(
        Notice.set({type: "NoPoolError", message: "No Pool Selected"})
      )

    handlers.select(e)
    if (!value) return
    runQuery(value)
  }

  const hasMultiSelected = tree.getSelectedIds().length > 1
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Run Query",
      enabled: !hasMultiSelected && !!currentPool,
      click: () => runQuery(value)
    },
    {
      label: "Copy Query",
      enabled: !hasMultiSelected,
      click: () => {
        lib.doc.copyToClipboard(value)
        toast("Query copied to clipboard")
      }
    },
    {type: "separator"},
    {
      label: "Rename",
      click: () => handlers.edit()
    },
    {
      label: "Edit",
      enabled: !hasMultiSelected,
      click: () => {
        // only edit queries
        if ("items" in data) return
        dispatch(Modal.show("edit-query", {query: data}))
      }
    },
    {type: "separator"},
    {
      label: hasMultiSelected ? "Delete Selected" : "Delete",
      click: () => {
        return remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Confirm Delete Query Window",
            message: `Are you sure you want to delete the ${
              hasMultiSelected ? tree.getSelectedIds().length : ""
            } selected quer${hasMultiSelected ? "ies" : "y"}?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0) {
              if (hasMultiSelected) {
                dispatch(Queries.removeItems(tree.getSelectedIds()))
              } else dispatch(Queries.removeItems([data.id]))
            }
          })
      }
    }
  ]

  const menu = usePopupMenu(template)
  const isGroup = "isOpen" in data
  const itemIcon = isGroup ? <Folder /> : <StarNoFillIcon />

  return (
    <BG
      tabIndex={0}
      ref={innerRef}
      style={styles.row}
      className={classNames(state)}
      onClick={onItemClick}
      onContextMenu={() => menu.open()}
    >
      <StyledItem isSelected={isSelected} style={styles.indent}>
        <GroupArrow
          isVisible={isGroup}
          show={data.isOpen}
          onClick={onGroupClick}
        />
        {itemIcon}
        {isEditing ? (
          <Rename item={data} onSubmit={handlers.submit} />
        ) : (
          <Show item={data} />
        )}
      </StyledItem>
    </BG>
  )
}
