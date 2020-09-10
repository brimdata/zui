import React, {MouseEvent} from "react"

import {ModalButton} from "./types"
import {defaultModalButton} from "../../test/locators"
import ButtonRow from "../ButtonRow"
import ToolbarButton from "../Toolbar/Button"

type Props = {
  template: ModalButton[]
  closeModal: Function
}

export default function Buttons({template, closeModal}: Props) {
  return (
    <ButtonRow>
      {template.map((b, i, a) => (
        <ButtonItem
          key={b.label}
          text={b.label}
          isLast={i + 1 === a.length}
          onClick={(e) => b.click(closeModal, e)}
        />
      ))}
    </ButtonRow>
  )
}

type ButtonItemProps = {
  text: string
  onClick: (e: MouseEvent) => void
  isLast: boolean
}

function ButtonItem({text, onClick, isLast}: ButtonItemProps) {
  if (isLast) {
    return (
      <ToolbarButton
        {...defaultModalButton.props}
        text={text}
        onClick={onClick}
      />
    )
  } else {
    return <ToolbarButton text={text} onClick={onClick} />
  }
}
