import React, {Component} from "react"
import WithOutsideClick from "./WithOutsideClick"
import CloseButton from "./CloseButton"

class ModalContents extends Component {
  render() {
    const {onClose, children, className} = this.props
    return (
      <div className={`modal-contents ${className}`}>
        <CloseButton light onClick={onClose} />
        {children}
      </div>
    )
  }
}

export default WithOutsideClick(ModalContents)
