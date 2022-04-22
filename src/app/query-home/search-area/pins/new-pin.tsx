import {MenuItemConstructorOptions} from "electron/main"
import React, {useRef} from "react"
import Icon from "src/app/core/icon-temp"
import {useDispatch} from "src/app/core/state"
import {showContextMenu} from "src/js/lib/System"
import Editor from "src/js/state/Editor"
import styled from "styled-components"
import popupPosition from "../popup-position"

const Button = styled.button`
  border: none;
  line-height: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  border-radius: 8px;
  background: var(--control-background);
  &:hover {
    background: var(--control-hover);
  }
  &:active {
    background: var(--control-active);
  }
`

const Dropdown = styled(Icon).attrs({name: "chevron-down"})`
  margin-left: 4px;
`

const showMenu = (anchor) => (dispatch, getState) => {
  const pins = Editor.getPins(getState())
  const menu = [
    {label: "Pin Editor Value", click: () => dispatch(Editor.pinValue())},
    {type: "separator"},
    {
      label: "New 'Generic' Pin",
      click: () => {
        dispatch(Editor.addPin({type: "generic", value: ""}))
        dispatch(Editor.editPin(pins.length))
      }
    },
    {
      label: "New 'From' Pin",
      click: () => {
        dispatch(Editor.addPin({type: "from", value: ""}))
        dispatch(Editor.editPin(pins.length))
      }
    },
    {
      label: "New 'Time Range' Pin",
      click: () => {
        dispatch(
          Editor.addPin({
            type: "time-range",
            from: new Date(),
            to: new Date()
          })
        )
        dispatch(Editor.editPin(pins.length))
      }
    }
  ] as MenuItemConstructorOptions[]
  const options = popupPosition(anchor)
  console.log(options)
  showContextMenu(menu, options)
}

export default function NewPin() {
  const dispatch = useDispatch()
  const ref = useRef()
  return (
    <Button
      ref={ref}
      onClick={() => {
        if (!ref.current) return
        dispatch(showMenu(ref.current))
      }}
    >
      <Icon name="pin" size={11} /> +
      <Dropdown size={11} />
    </Button>
  )
}
