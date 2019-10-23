/* @flow */
import React from "react"

import {InputSubmit} from "../form/Inputs"
import type {ModalButton} from "./types"
import {isArray, isString} from "../../lib/is"
import ButtonRow from "../ButtonRow"

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
        <InputSubmit
          key={b.label}
          value={b.label}
          type="button"
          onClick={(e) => onClick(b, e)}
        />
      ))}
    </ButtonRow>
  )
}
