import React from "react"
import useLakeId from "src/app/router/hooks/use-lake-id"
import tabHistory from "src/app/router/tab-history"
import {lakeImportPath} from "src/app/router/utils/paths"
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
import brim from "src/js/brim"

const LakeNameGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 12px 6px;
  user-select: none;
  width: 100%;
  border-radius: 6px;
  padding: 6px 10px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  svg {
    height: 8px;
    width: 8px;
    stroke: var(--slate);
    margin-left: 6px;
  }
`

const NameColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  label {
    ${(props) => props.theme.typography.labelBold};
    color: var(--aqua);
  }
  label:last-child {
    ${(props) => props.theme.typography.labelSmall};
    color: var(--lead);
  }
`

const showLakeSelectMenu = () => (dispatch, getState) => {
  const lakes = Lakes.all(getState())
  const currentId = Current.getLakeId(getState())

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Get Info",
      click: () => dispatch(Modal.show("view-lake"))
    },
    {type: "separator"}
  ]

  lakes.forEach((l: Lake) => {
    const isCurrent = l.id === currentId
    template.push({
      type: "checkbox",
      label: l.name,
      checked: isCurrent,
      click: () => {
        if (isCurrent) return
        dispatch(tabHistory.push(lakeImportPath(l.id)))
      }
    })
  })

  showContextMenu(template)
}

export default function LakePicker() {
  const dispatch = useDispatch<AppDispatch>()
  const lakeId = useLakeId()
  const current = brim.lake(useSelector(Lakes.id(lakeId)))

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
