/* @flow */
import React from "react"

import type {ModalButton} from "./types"
import {isArray, isString} from "../../lib/is"
import ButtonRow from "../ButtonRow"
import ToolbarButton from "../ToolbarButton"

type Props = {
  template: void | string | ModalButton[],
  closeModal: Function
}

export default function Buttons({template, closeModal}: Props) {
  let buttons = []

  if (isString(template)) {
    buttons = [{label: template, click: closeModal}]
  }

  if (isArray(template)) {
    buttons = template
  }

  function onClick(button: ModalButton, e: PointerEvent) {
    button.click(closeModal, e)
  }

  return (
    <ButtonRow>
      {buttons.map((b) => (
        <ToolbarButton
          text={b.label}
          key={b.label}
          onClick={(e) => onClick(b, e)}
        />
      ))}
    </ButtonRow>
  )
}
