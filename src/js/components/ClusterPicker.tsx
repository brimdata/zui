import {useDispatch, useSelector} from "react-redux"
import React, {ComponentType} from "react"
import styled from "styled-components"

import {setConnection} from "../flows/setConnection"
import Clusters from "../state/Clusters"
import Current from "../state/Current"
import DropdownArrow from "../icons/DropdownArrow"
import Modal from "../state/Modal"
import Notice from "../state/Notice"
import usePopupMenu from "./hooks/usePopupMenu"
import {Cluster} from "../state/Clusters/types"
import {AppDispatch} from "../state/types"
import {MenuItem, MenuItemConstructorOptions} from "electron"

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
  const current = useSelector(Current.getConnection)
  const clusters = useSelector(Clusters.all)

  const template: MenuItemConstructorOptions[] = clusters.map((c: Cluster) => {
    const isCurrent = c.id === current.id
    return {
      type: "checkbox",
      label: c.id,
      checked: isCurrent,
      click: () => {
        if (isCurrent) return
        dispatch(setConnection(c)).catch((e) => {
          dispatch(Notice.set(e))
        })
      }
    }
  })

  template.push(
    {type: "separator"},
    {
      label: "+ New Connection",
      click: () => dispatch(Modal.show("new-connection"))
    }
  )

  const menu = usePopupMenu(template)

  return (
    <ClusterPickerWrapper onClick={menu.onClick}>
      <label>{`${current.host}:${current.port}`}</label>
      <DropdownArrow />
    </ClusterPickerWrapper>
  )
}
