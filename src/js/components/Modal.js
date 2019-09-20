/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"

import {InputSubmit} from "./form/Inputs"
import type {ModalName} from "../modal/types"
import {isString} from "../lib/is"
import ButtonRow from "./ButtonRow"
import CloseButton from "./CloseButton"
import * as Doc from "../lib/Doc"
import modal from "../modal"
import useListener from "../hooks/useListener"

type Button = {label: string, click: Function}
type Props = {
  children: *,
  title: string,
  name: ModalName,
  className?: string,
  buttons: string | Button[]
}

export default function Modal({name, children, ...contentProps}: Props) {
  let active = useSelector(modal.getName)
  if (active !== name) {
    return null
  } else {
    return ReactDOM.createPortal(
      <div className="modal-overlay">
        <ModalContents {...contentProps}>{children}</ModalContents>
      </div>,
      Doc.id("modal-root")
    )
  }
}

function ModalContents({children, className, title, buttons}) {
  let dispatch = useDispatch()

  useListener(document, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.stopPropagation()
      e.preventDefault()
      close()
    }
  })

  const close = () => dispatch(modal.hide())
  const onClick = (button, e) => button.click(close, e)

  function getButtons(): Button[] {
    if (isString(buttons)) {
      return [{label: buttons, click: close}]
    } else if (!buttons) {
      return []
    } else {
      return buttons
    }
  }

  return (
    <div className={classNames("modal-contents", className)}>
      <CloseButton light onClick={close} />
      <h2 className="modal-header">{title}</h2>
      <div className="modal-body">{children}</div>
      <ButtonRow>
        {getButtons().map((b) => (
          <InputSubmit
            key={b.label}
            value={b.label}
            type="button"
            onClick={(e) => onClick(b, e)}
          />
        ))}
      </ButtonRow>
    </div>
  )
}
