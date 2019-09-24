/* @flow */
import React from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"

import type {ModalContentsProps} from "./types"
import Buttons from "./Buttons"
import CloseButton from "../CloseButton"
import lib from "../../lib"
import useModalAnimation from "./useModalAnimation"
import useModalController from "./useModalController"

export default function ModalContents({
  children,
  className,
  title,
  buttons,
  duration,
  willUnmount
}: ModalContentsProps) {
  let {close} = useModalController()
  useModalAnimation(duration, willUnmount)

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className={classNames("modal-contents", className)}>
        <CloseButton light onClick={close} />
        <h2 className="modal-header">{title}</h2>
        <div className="modal-body">{children}</div>
        <Buttons template={buttons} close={close} />
      </div>
    </div>,
    lib.doc.id("modal-root")
  )
}
