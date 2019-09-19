/* @flow */
import React, {Component} from "react"
import ReactDOM from "react-dom"

import * as Doc from "../lib/Doc"
import ModalContents from "./ModalContents"

type Props = {
  onClose: Function,
  children: *,
  isOpen: boolean,
  className?: string,
  title: string,
  width?: number | string
}

class Modal extends Component<Props> {
  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.props.onClose()
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown)
  }

  render() {
    const {onClose, children, isOpen, className, width} = this.props
    if (!isOpen) return null

    return ReactDOM.createPortal(
      <div className="modal-overlay">
        <ModalContents
          title={this.props.title}
          className={className}
          onOutsideClick={onClose}
          onClose={onClose}
          width={width || "80%"}
        >
          {children}
        </ModalContents>
      </div>,
      Doc.id("modal-root")
    )
  }
}

export default Modal
