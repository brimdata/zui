import React, {Component} from "react"

import {Fieldset} from "./Typography"
import CloseButton from "./CloseButton"
import WithOutsideClick from "./WithOutsideClick"

class ModalContents extends Component {
  render() {
    const {onClose, children, className, title} = this.props
    return (
      <div className={`modal-contents ${className}`}>
        <header className="modal-header">
          <Fieldset>{title}</Fieldset>
          <CloseButton light onClick={onClose} />
        </header>
        <div className="modal-body">{children}</div>
      </div>
    )
  }
}

export default WithOutsideClick(ModalContents)
