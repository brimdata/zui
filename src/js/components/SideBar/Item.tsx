import classNames from "classnames"
import React, {useRef} from "react"
import styled from "styled-components"
import Notice from "../../state/Notice"
import {useDispatch, useSelector} from "react-redux"
import Current from "../../state/Current"
import SearchBar from "../../state/SearchBar"
import {submitSearch} from "../../flows/submitSearch/mod"
import {MenuItemConstructorOptions, remote} from "electron"
import lib from "../../lib"
import toast from "react-hot-toast"
import Modal from "../../state/Modal"
import Queries from "../../state/Queries"
import usePopupMenu from "../hooks/usePopupMenu"

const BG = styled.div`
  padding-left: 18px;
  height: 24px;
  font-family: system-ui;
  font-weight: 400;
  font-size: 11px;
  line-height: 24px;
  color: var(--aqua);
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: default !important;
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
  font-size: 11px;
  line-height: 19px;
  color: var(--aqua);
  padding: 0 1px;
  border: 1px solid var(--havelock);
  height: 19px;
  outline: none;
  border-radius: 2px;
  margin: 0 2px 0 -2px;
  margin-right: 2px;
  width: 100%;
`

function Show({item}) {
  return <Name>{item.name}</Name>
}

function Edit({item}) {
  const input = useRef()
  // useLayoutEffect(() => input.current.select(), [])
  //   useOutsideClick(input, () => ctx.onRename(item, input.current.value))
  //   const onEnter = (e) =>
  // e.key === "Enter" && ctx.onRename(item, input.current.value)
  //   const onEscape = (e) => e.key === "Escape" && ctx.onRename(item, item.name)

  return (
    <Input
      ref={input}
      // onKeyPress={onEnter}
      // onKeyDown={onEscape}
      type="text"
      autoFocus
      defaultValue={item.name}
    />
  )
}

export default function Item({indent, props, node, state, handlers}) {
  const dispatch = useDispatch()
  const currentPool = useSelector(Current.getPool)
  const isEditing = false // for later
  const item = node.model

  const runQuery = (value) => {
    dispatch(SearchBar.clearSearchBar())
    dispatch(SearchBar.changeSearchBarInput(value))
    dispatch(submitSearch())
  }

  const onItemClick = () => {
    if (!currentPool)
      return dispatch(
        Notice.set({type: "NoPoolError", message: "No Pool Selected"})
      )

    if (!item.value) return

    runQuery(item.value)
  }

  const hasMultiSelected =
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Run Query",
      enabled: !hasMultiSelected && !!currentPool,
      click: () => {
        const {
          item: {value}
        } = contextArgs

        runQuery(value)
      }
    },
    {
      label: "Copy Query",
      enabled: !hasMultiSelected,
      click: () => {
        const {
          item: {value}
        } = contextArgs
        lib.doc.copyToClipboard(value)
        toast("Query copied to clipboard")
      }
    },
    {type: "separator"},
    {
      label: "Edit",
      enabled: !hasMultiSelected,
      click: () => {
        const {item} = contextArgs
        // only edit queries
        if ("items" in item) return
        dispatch(Modal.show("edit-query", {query: item}))
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
            message: `Are you sure you want to delete the ${(contextArgs.selections &&
              contextArgs.selections.length) ||
              ""} selected quer${hasMultiSelected ? "ies" : "y"}?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0) {
              const {selections, item} = contextArgs
              if (hasMultiSelected) dispatch(Queries.removeItems(selections))
              else dispatch(Queries.removeItems([item]))
            }
          })
      }
    }
  ]

  const menu = usePopupMenu(template)

  return (
    <BG
      {...props}
      className={classNames(state)}
      onClick={onItemClick}
      onContextMenu={menu.open}
    >
      <div style={{paddingLeft: indent}}>
        {isEditing ? <Edit item={item} /> : <Show item={item} />}
      </div>
    </BG>
  )
}
