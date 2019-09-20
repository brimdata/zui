/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"

import {InputSubmit} from "./form/Inputs"
import {getModal} from "../state/reducers/view"
import {hideModal} from "../state/actions"
import ButtonRow from "./ButtonRow"
import CloseButton from "./CloseButton"
import * as Doc from "../lib/Doc"
import useListener from "../hooks/useListener"

type Props = {
  children: *,
  title: string,
  name: string,
  className?: string,
  style?: Object,
  buttons: string
}

export default function Modal({name, children, ...contentProps}: Props) {
  let active = useSelector(getModal)
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

function ModalContents({children, className, title, style, buttons}) {
  let dispatch = useDispatch()

  function onClose() {
    dispatch(hideModal())
  }

  useListener(document, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.stopPropagation()
      e.preventDefault()
      onClose()
    }
  })

  return (
    <div className={classNames("modal-contents", className)} style={style}>
      <CloseButton light onClick={onClose} />
      <h2 className="modal-header">{title}</h2>
      <div className="modal-body">{children}</div>
      <ButtonRow>
        <InputSubmit value={buttons} type="button" onClick={onClose} />
      </ButtonRow>
    </div>
  )
}
