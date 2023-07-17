import React from "react"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {MenuItemConstructorOptions} from "electron"
import {useDispatch, useSelector} from "react-redux"
import styled from "styled-components"
import DropdownArrow from "src/js/icons/DropdownArrow"
import {showContextMenu} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Modal from "src/js/state/Modal"
import {AppDispatch} from "src/js/state/types"
import Lakes from "src/js/state/Lakes"
import {Lake} from "src/js/state/Lakes/types"
import lake from "src/js/models/lake"
import Window from "src/js/state/Window"

const LakeNameGroup = styled.div`
  display: flex;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 10px;
  padding-right: 24px;
  margin: 0 6px;
  border-radius: 6px;
  min-width: 0;
  position: relative;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    svg {
      opacity: 0.5;
    }
  }

  svg {
    opacity: 0;
    position: absolute;
    bottom: 12px;
    right: 8px;
    height: 8px;
    width: 8px;
    stroke: var(--foreground-color);
  }
`

const NameColumn = styled.div`
  overflow: hidden;
  label {
    display: block;
    font-size: 14px;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  label:last-child {
    font-size: 13px;
    font-weight: normal;
    font-family: var(--moo-font);
    opacity: 0.5;
  }
`

const showLakeSelectMenu = () => (dispatch, getState) => {
  const lakes = Lakes.all(getState())
  const currentId = Current.getLakeId(getState())

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Get Info",
      click: () => dispatch(Modal.show("view-lake")),
    },
    {type: "separator"},
  ]

  lakes.forEach((l: Lake) => {
    const isCurrent = l.id === currentId
    template.push({
      type: "checkbox",
      label: l.name,
      checked: isCurrent,
      click: () => {
        if (isCurrent) return
        dispatch(Window.setLakeId(l.id))
      },
    })
  })

  showContextMenu(template)
}

export default function LakePicker() {
  const dispatch = useDispatch<AppDispatch>()
  const lakeId = useLakeId()
  const current = lake(useSelector(Lakes.id(lakeId)))

  return (
    <LakeNameGroup onClick={() => dispatch(showLakeSelectMenu())}>
      <NameColumn>
        <label>{`${current?.name}`}</label>
        <label>{`${current?.getAddress()}`}</label>
      </NameColumn>
      <DropdownArrow />
    </LakeNameGroup>
  )
}
