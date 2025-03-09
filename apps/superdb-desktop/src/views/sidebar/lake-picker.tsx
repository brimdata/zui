import React from "react"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {useDispatch, useSelector} from "react-redux"
import styled from "styled-components"
import {MenuItem, showContextMenu} from "src/core/menu"
import Current from "src/js/state/Current"
import Modal from "src/js/state/Modal"
import {AppDispatch} from "src/js/state/types"
import Lakes from "src/js/state/Lakes"
import {LakeAttrs} from "src/js/state/Lakes/types"
import {Lake} from "src/models/lake"
import Window from "src/js/state/Window"

const LakeNameGroup = styled.div`
  display: flex;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 10px;
  padding-right: 10px;
  margin: 0 6px;
  border-radius: 6px;
  min-width: 0;
  position: relative;
  transition: all var(--dur-s);
  &:hover {
    background: var(--emphasis-bg);
  }
  &:active {
    background: var(--emphasis-bg-more);
  }
`

const showLakeSelectMenu = () => (dispatch, getState) => {
  const lakes = Lakes.all(getState())
  const currentId = Current.getLakeId(getState())

  const template: MenuItem[] = [
    {
      label: "Get Info",
      click: () => dispatch(Modal.show("view-lake")),
    },
    {type: "separator"},
  ]

  lakes.forEach((l: LakeAttrs) => {
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
  const current = new Lake(useSelector(Lakes.id(lakeId)))

  return (
    <LakeNameGroup onClick={() => dispatch(showLakeSelectMenu())}>
      <div className="overflow:hidden">
        <p className="overflow:ellipsis weight:bold">{`${current?.name}`}</p>
        <p className="overflow:ellipsis font:mono font-size:-2 color:fg-less">{`${current?.getAddress()}`}</p>
      </div>
    </LakeNameGroup>
  )
}
