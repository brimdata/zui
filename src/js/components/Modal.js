/* @flow */
import {CSSTransition} from "react-transition-group"
import React, {Component} from "react"
import ReactDOM from "react-dom"

import * as Doc from "../lib/Doc"
import ModalContents from "./ModalContents"

type Props = {
  onClose: Function,
  children: *,
  isOpen: boolean,
  className?: string,
  title: string
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
    const {onClose, children, isOpen, className} = this.props
    if (!isOpen) return null

    return ReactDOM.createPortal(
      <CSSTransition
        in={this.props.isOpen}
        classNames="dim-portal-overlay"
        timeout={{enter: 200}}
        onClick={this.props.onClose}
        appear
      >
        <div className="modal-overlay">
          <ModalContents
            title={this.props.title}
            className={className}
            onOutsideClick={onClose}
            onClose={onClose}
          >
            {children}
          </ModalContents>
        </div>
      </CSSTransition>,
      Doc.id("modal-root")
    )
  }
}

export default Modal
