/* @flow */
import React, {type ComponentType} from "react"
import {useDispatch, useSelector} from "react-redux"
import Clusters from "../state/Clusters"
import styled from "styled-components"
import {setConnection} from "../flows/setConnection"
import usePopupMenu from "./hooks/usePopupMenu"

import Current from "../state/Current"
import Notice from "../state/Notice"
import Modal from "../state/Modal"
import DropdownArrow from "../icons/DropdownArrow"

const ClusterPickerWrapper = (styled.div`
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
`: ComponentType<*>)

export default function ClusterPicker() {
  const dispatch = useDispatch()
  const current = useSelector(Current.getConnection)
  const clusters = useSelector(Clusters.all)

  const template = clusters.map((c) => {
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

  const openMenu = usePopupMenu(template)

  const onClick = (e) => {
    openMenu(e.currentTarget)
  }

  return (
    <ClusterPickerWrapper onClick={onClick}>
      <label>{`${current.host}:${current.port}`}</label>
      <DropdownArrow />
    </ClusterPickerWrapper>
  )
}
