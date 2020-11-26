import {useDispatch, useSelector} from "react-redux"
import React, {ComponentType} from "react"
import styled from "styled-components"

import Clusters from "../state/Clusters"
import Current from "../state/Current"
import DropdownArrow from "../icons/DropdownArrow"
import Modal from "../state/Modal"
import usePopupMenu from "./hooks/usePopupMenu"
import {Cluster} from "../state/Clusters/types"
import {AppDispatch} from "../state/types"
import {MenuItemConstructorOptions} from "electron"
import {initConnection} from "../flows/initConnection"

const ClusterPickerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 11px 12px;
  user-select: none;

  label {
    ${(props) => props.theme.typography.labelBold};
    color: ${(props) => props.theme.colors.aqua};
  }

  svg {
    height: 11px;
    width: 11px;
    stroke: ${(props) => props.theme.colors.slate};
    margin-left: 6px;
  }
` as ComponentType<any>

export default function ClusterPicker() {
  const dispatch = useDispatch<AppDispatch>()
  const clusters = useSelector(Clusters.all)
  const current = useSelector(Current.getConnection)

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Get Info",
      click: () => dispatch(Modal.show("view-connection"))
    },
    {type: "separator"}
  ]

  clusters.forEach((c: Cluster) => {
    const isCurrent = c.id === current.id
    template.push({
      type: "checkbox",
      label: c.name,
      checked: isCurrent,
      click: () => {
        if (isCurrent) return
        dispatch(initConnection(c)).catch(() => {
          dispatch(Current.setConnectionId(c.id))
        })
      }
    })
  })

  template.push(
    {type: "separator"},
    {
      label: "New Connection...",
      click: () => dispatch(Modal.show("new-connection"))
    }
  )

  const menu = usePopupMenu(template)

  return (
    <ClusterPickerWrapper onClick={menu.onClick}>
      <label>{`${current.name}`}</label>
      <DropdownArrow />
    </ClusterPickerWrapper>
  )
}
