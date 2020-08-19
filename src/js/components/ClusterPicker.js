/* @flow */
import React, {type ComponentType} from "react"
import {useDispatch, useSelector} from "react-redux"
import Clusters from "../state/Clusters"
import styled from "styled-components"
import {setConnection} from "../flows/setConnection"
import usePopupMenu from "./hooks/usePopupMenu"
import electronIsDev from "../electron/isDev"

import Current from "../state/Current"

const ClusterPickerWrapper = (styled.div`
  display: flex;
  flex-direction: column;
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
      click: () => !isCurrent && dispatch(setConnection(c))
    }
  })

  template.push(
    {type: "separator"},
    {
      label: "+ New Connection",
      click: () => dispatch(Current.setConnectionId(""))
    }
  )

  const openMenu = usePopupMenu(template)

  const onContextMenu = (e) => {
    electronIsDev && openMenu(e.currentTarget)
  }

  return (
    <ClusterPickerWrapper onContextMenu={onContextMenu}>
      <label>{current.id}</label>
    </ClusterPickerWrapper>
  )
}
