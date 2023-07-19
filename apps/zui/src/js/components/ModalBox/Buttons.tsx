import React, {MouseEvent} from "react"

import {ModalButton} from "./types"
import ButtonRow from "../ButtonRow"
import ToolbarButton from "src/app/query-home/toolbar/actions/button"

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
          disabled={b.disabled}
          icon={b.icon}
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
  disabled?: boolean
  icon?: React.ReactNode
  showSpinner?: boolean
}

function ButtonItem({
  text,
  onClick,
  isLast,
  disabled = false,
  icon = null,
}: ButtonItemProps) {
  if (isLast) {
    return (
      <ToolbarButton
        text={text}
        icon={icon}
        disabled={disabled}
        onClick={onClick}
      />
    )
  }

  return (
    <ToolbarButton
      text={text}
      onClick={onClick}
      disabled={disabled}
      icon={icon}
    />
  )
}
