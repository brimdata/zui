/* @flow */
import React from "react"

import type {ModalButton} from "./types"
import ButtonRow from "../ButtonRow"
import ToolbarButton from "../ToolbarButton"

type Props = {
  template: ModalButton[],
  closeModal: Function
}

export default function Buttons({template, closeModal}: Props) {
  return (
    <ButtonRow>
      {template.map((b) => (
        <ToolbarButton
          text={b.label}
          key={b.label}
          onClick={(e) => b.click(closeModal, e)}
        />
      ))}
    </ButtonRow>
  )
}
