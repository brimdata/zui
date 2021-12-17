import classNames from "classnames"
import {ipcRenderer, MenuItemConstructorOptions} from "electron"
import * as remote from "@electron/remote"
import React, {useLayoutEffect, useRef} from "react"
import toast from "react-hot-toast"
import {useDispatch, useSelector} from "react-redux"
import lib from "src/js/lib"
import styled from "styled-components"
import {submitSearch} from "../../flows/submitSearch/mod"
import Folder from "../../icons/Folder"
import StarNoFillIcon from "../../icons/StarNoFillIcon"
import Current from "../../state/Current"
import Modal from "../../state/Modal"
import Notice from "../../state/Notice"
import Queries from "../../state/Queries"
import {isBrimLib} from "../../state/Queries/flows"
import SearchBar from "../../state/SearchBar"
import useOutsideClick from "../hooks/useOutsideClick"
import {StyledArrow} from "../LeftPane/common"
import {useBrimApi} from "../../../../app/core/context"
import exportQueryLib from "../../flows/exportQueryLib"
import {AppDispatch} from "../../state/types"
import {brimQueryLib} from "../../../../test/playwright/helpers/locators"
import {showContextMenu} from "../../lib/System"

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

  &:hover {
    background-color: hsla(0 0% 0% / 0.03);
  }
  &:active {
    background-color: hsla(0 0% 0% / 0.08);
  }

  &.isSelected {
    background-color: var(--havelock);
    color: white;
  }
  &.isOverFolder {
    background-color: hsla(0 0% 0% / 0.06);
  }

  &.isDragging:not(.isSelected) {
    background-color: inherit;
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
  line-height: 24px;
  color: var(--aqua);
  padding: 0 3px;
  border: 1px solid var(--havelock);
  height: 19px;
  outline: none;
  border-radius: 2px;
  margin: 0 2px 0 -4px;
  width: 100%;
  flex: 1;
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
  width: 100%;

  ${GroupArrow} {
    opacity: ${(p) => (p.isSelected ? 1 : 0.45)};
    fill: ${(p) => (p.isSelected ? "white" : "var(--lead)")};
  }

  ${Folder}, ${StarNoFillIcon} {
    margin-right: 6px;
    width: 12px;
    height: 12px;
  }

  ${Folder} {
    fill: ${(p) => (p.isSelected ? "white" : "var(--lead)")};
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
  useOutsideClick(input, () => onSubmit(input.current.value))
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
  const dispatch = useDispatch<AppDispatch>()
  const currentPool = useSelector(Current.getPool)
  const {isEditing, isSelected} = state
  const {value, id} = data
  const isGroup = "items" in data
  const api = useBrimApi()

  const selected = Array.from(new Set([...tree.getSelectedIds(), data.id]))
  const hasMultiSelected = selected.length > 1

  const isBrimItem = dispatch(isBrimLib([id]))
  const hasBrimItemSelected = dispatch(isBrimLib(selected))

  const runQuery = (value) => {
    dispatch(SearchBar.clearSearchBar())
    dispatch(SearchBar.changeSearchBarInput(value))
    dispatch(submitSearch())
  }

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
      runQuery(value)
    }
  }

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Run Query",
      enabled: !hasMultiSelected && !!currentPool,
      visible: !isGroup,
      click: () => runQuery(value)
    },
    {
      label: "Copy Query",
      enabled: !hasMultiSelected,
      visible: !isGroup,
      click: () => {
        lib.doc.copyToClipboard(value)
        toast("Query copied to clipboard")
      }
    },
    {
      label: "Export Folder as JSON",
      visible: isGroup && !hasMultiSelected,
      click: async () => {
        const {canceled, filePath} = await ipcRenderer.invoke(
          "windows:showSaveDialog",
          {
            title: `Save Queries Folder as JSON`,
            buttonLabel: "Export",
            defaultPath: `${data.name}.json`,
            properties: ["createDirectory"],
            showsTagField: false
          }
        )
        if (canceled) return
        toast.promise(
          dispatch(exportQueryLib(filePath, api.exportQueries(id))),
          {
            loading: "Exporting Queries...",
            success: "Export Complete",
            error: "Error Exporting Queries"
          }
        )
      }
    },
    {type: "separator"},
    {
      label: "Rename",
      enabled: !isBrimItem,
      click: () => handlers.edit()
    },
    {
      label: "Edit",
      enabled: !hasMultiSelected && !isBrimItem,
      visible: !isGroup,
      click: () => dispatch(Modal.show("edit-query", {query: data}))
    },
    {type: "separator"},
    {
      label: hasMultiSelected ? "Delete Selected" : "Delete",
      enabled: !hasBrimItemSelected,
      click: () => {
        const selected = Array.from(
          new Set([...tree.getSelectedIds(), data.id])
        )
        return remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Confirm Delete Query Window",
            message: `Are you sure you want to delete the ${
              selected.length > 1 ? selected.length : ""
            } selected item${selected.length > 1 ? "s" : ""}?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0) dispatch(Queries.removeItems(selected))
          })
      }
    }
  ]

  const itemIcon = isGroup ? <Folder /> : <StarNoFillIcon />

  const maybeBrimLibTestProps = id === "brim" && brimQueryLib.props

  return (
    <BG
      tabIndex={0}
      ref={innerRef}
      style={styles.row}
      className={classNames(state)}
      onClick={onItemClick}
      onContextMenu={() => showContextMenu(template)}
      {...maybeBrimLibTestProps}
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
