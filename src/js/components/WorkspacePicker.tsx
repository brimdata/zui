import {useDispatch, useSelector} from "react-redux"
import React, {ComponentType} from "react"
import styled from "styled-components"

import Workspaces from "../state/Workspaces"
import Current from "../state/Current"
import DropdownArrow from "../icons/DropdownArrow"
import Modal from "../state/Modal"
import usePopupMenu from "./hooks/usePopupMenu"
import {Workspace} from "../state/Workspaces/types"
import {AppDispatch} from "../state/types"
import {MenuItemConstructorOptions} from "electron"
import {initWorkspace} from "../flows/initWorkspace"

const WorkspacePickerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 11px 12px;
  user-select: none;

  label {
    ${(props) => props.theme.typography.labelBold};
    color: var(--aqua);
  }

  svg {
    height: 11px;
    width: 11px;
    stroke: var(--slate);
    margin-left: 6px;
  }
` as ComponentType<any>

export default function WorkspacePicker() {
  const dispatch = useDispatch<AppDispatch>()
  const workspaces = useSelector(Workspaces.all)
  const current = useSelector(Current.getWorkspace)

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Get Info",
      click: () => dispatch(Modal.show("view-workspace"))
    },
    {type: "separator"}
  ]

  workspaces.forEach((w: Workspace) => {
    const isCurrent = w.id === current.id
    template.push({
      type: "checkbox",
      label: w.name,
      checked: isCurrent,
      click: () => {
        if (isCurrent) return
        dispatch(initWorkspace(w)).catch(() => {
          dispatch(Current.setWorkspaceId(w.id))
        })
      }
    })
  })

  template.push(
    {type: "separator"},
    {
      label: "New Workspace...",
      click: () => dispatch(Modal.show("new-workspace"))
    }
  )

  const menu = usePopupMenu(template)

  return (
    <WorkspacePickerWrapper onClick={menu.onClick}>
      <label>{`${current.name}`}</label>
      <DropdownArrow />
    </WorkspacePickerWrapper>
  )
}
