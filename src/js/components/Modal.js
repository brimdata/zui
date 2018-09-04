import React, {Component} from "react"
import ReactDOM from "react-dom"
import ModalContents from "./ModalContents"

class Modal extends Component {
  render() {
    const {onClose, children, isOpen, className} = this.props
    if (!isOpen) return null

    return ReactDOM.createPortal(
      <div className="modal-overlay">
        <ModalContents
          className={className}
          onOutsideClick={onClose}
          onClose={onClose}
        >
          {children}
        </ModalContents>
      </div>,
      document.getElementById("modal-root")
    )
  }
}

export default Modal
