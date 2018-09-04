import React, {Component} from "react"
import WithOutsideClick from "./WithOutsideClick"
import X from "../icons/x-lg.svg"

class ModalContents extends Component {
  render() {
    const {onClose, children, className} = this.props
    return (
      <div className={`modal-contents ${className}`}>
        <button className="close-button panel-button" onClick={onClose}>
          <X />
        </button>
        {children}
      </div>
    )
  }
}

export default WithOutsideClick(ModalContents)
