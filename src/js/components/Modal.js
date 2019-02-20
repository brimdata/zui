import React, {Component} from "react"
import ReactDOM from "react-dom"
import ModalContents from "./ModalContents"
import * as Doc from "../lib/Doc"

class Modal extends Component {
  constructor(props) {
    super(props)
    this.onKeyDown = e => {
      if (e.key === "Escape") this.props.onClose()
    }
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
      <div className="modal-overlay">
        <ModalContents
          title={this.props.title}
          className={className}
          onOutsideClick={onClose}
          onClose={onClose}
        >
          {children}
        </ModalContents>
      </div>,
      Doc.id("modal-root")
    )
  }
}

export default Modal
